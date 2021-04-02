import React from 'react';
import axios from 'axios';
import MurbFinancialBar from './MURB/MurbFinancialBar';
import { Button, ButtonGroup, Card, CardContent, Grid, Container } from '@material-ui/core';
import { compareAsc, format, formatISO, parse, parseISO, subMinutes } from 'date-fns';
import Typography from '@material-ui/core/Typography';

export default class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      murbData: [],
      evData: [],
      tickValues: [],
      liveIntervalId: 0,
      currentInterval: 'pastWeek',
      totalMurbCost: 0,
      totalEvCost: 0,
    };
    this.changeInterval = this.changeInterval.bind(this);
    this.mergeArraysUsingTimestamp = this.mergeArraysUsingTimestamp.bind(this);
  }

  componentDidMount() {
    this.sendCurrentRequest()
  }

  sortData(data) {
    return data.sort((dataLeft, dataRight) => compareAsc(parseISO(dataLeft.TimeStamp), parseISO(dataRight.TimeStamp)));
  }

  formatData(data) {
    const formattedData = [];
    const formats = {
      "pastDay": "HH:mm",
      "pastWeek": "EEEE",
      "pastMonth": "dd/MM/yyyy",
      "pastYear": "LLLL"
    };

    // loop across the data and change the format of the datas x values
    data.forEach(element => {
      const date = parseISO(element.TimeStamp);
      const formattedDate = format(date, formats[this.state.currentInterval]);

      formattedData.push({
        ...element,
        Cost: element.Cost.toFixed(2),
        TimeStamp: formattedDate
      })
    })
    return formattedData;
  }

  sendCurrentRequest() {
    axios.get('/api/murb/' + this.state.currentInterval)
      .then((res) => {
        const {
          aggregatedData,
        } = res.data;

        const sortedData = this.sortData(aggregatedData)
        const formattedData = this.formatData(sortedData);

        const totalMurbCost = aggregatedData.reduce((total, data) => total + data.Cost, 0).toFixed(2);

        this.setState(() => ({
          tickValues: this.generateTickValues(formattedData.map(data => data.TimeStamp)),
          murbData: formattedData.map(data => ({ TimeStamp: data.TimeStamp, MurbCost: data.Cost })),
          totalMurbCost
        }))

        return axios.get('/api/ev/' + this.state.currentInterval)
      })
      .then(res => {
        const {
          aggregatedData,
        } = res.data;

        const sortedData = this.sortData(aggregatedData)
        const formattedData = this.formatData(sortedData);

        const totalEvCost = aggregatedData.reduce((total, data) => total + data.Cost, 0).toFixed(2);
        const reducedData = this.reduceArrayUsingTimeStamp(formattedData);
        

        this.setState(() => ({
          evData: reducedData.map(data => ({ TimeStamp: data.TimeStamp, EvCost: data.Cost })),
          totalEvCost
        }))
      })
  }

  generateTickValues(timestamps) {
    const tickValues = [];
    timestamps.forEach((timestamp, index) => {
      if ((index % 5) == 1) tickValues.push(timestamp);
    });
    return tickValues;
  }

  changeInterval(interval) {
    this.stopLast();
    this.setState({
      currentInterval: interval
    }, this.sendCurrentRequest);

  }

  stopLast() {
    clearInterval(this.state.currentInterval);
  }

  reduceArrayUsingTimeStamp(array) {
    return array.reduce((reducedArray, data) => {
      const index = reducedArray.findIndex(element => element.TimeStamp === data.TimeStamp);
      
      if (index >= 0) {
        reducedArray[index].Cost = parseFloat(reducedArray[index].Cost) + parseFloat(data.Cost);
        reducedArray[index].Cost = reducedArray[index].Cost.toFixed(2);

      } else {
        reducedArray.push(data);
      }

      return reducedArray;

    }, [])
  }

  mergeArraysUsingTimestamp(arraysToMerge) {
    const mergedArray = [];

    arraysToMerge.forEach(array => {
      array.forEach(data => {
        const index = mergedArray.findIndex(element => element.TimeStamp === data.TimeStamp);

        if (index >= 0) {
          mergedArray[index] = {...mergedArray[index], ...data};
        } else {
          mergedArray.push(data);
        }
      });
    });

    return mergedArray;
  }
  
  render() {
    return (
      <Grid
        container
        spacing={3}
        justify="space-between"
      >
        <Grid style={{ marginBottom:"50px" }} item xs={12}>
          <Typography variant="h5">
            Financial Data for your MURB
          </Typography>
          <MurbFinancialBar
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            data={this.mergeArraysUsingTimestamp([this.state.murbData, this.state.evData]) || []}
            tickValues={this.state.tickValues}
          />
        </Grid>
        <Grid xs={6}>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={() => this.changeInterval("pastYear")}>Past Year</Button>
            <Button disabled>Past 3 Months</Button>
            <Button onClick={() => this.changeInterval("pastMonth")}>Past Month</Button>
            <Button onClick={() => this.changeInterval("pastWeek")}>Past Week</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={4} style={{marginRight:"50px", textAlign: 'left'}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                <b>Total Cost Over Period:</b> ${this.state.totalMurbCost} <br/>
                <b>Total Reimbursed Over Period:</b> ${this.state.totalEvCost}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}