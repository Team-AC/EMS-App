import React from 'react';
import axios from 'axios';
import MurbFinancialBar from './MurbFinancialBar';
import { Button, ButtonGroup, Card, CardContent, Grid, Container } from '@material-ui/core';
import { compareAsc, format, formatISO, parse, parseISO, subMinutes } from 'date-fns';
import Typography from '@material-ui/core/Typography';

export default class Financial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      tickValues: [],
      liveIntervalId: 0,
      currentInterval: '',
      totalCost: 0
    };
    this.changeInterval = this.changeInterval.bind(this);
  }

  onChangeStartDate(startDate) {
    this.stopLive();
    this.setState(() => ({
      startDate
    }), this.sendRequest);
  }

  onChangeEndDate(endDate) {
    this.stopLive();
    this.setState(() => ({
      endDate
    }), this.sendRequest);
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

        const totalCost = aggregatedData.reduce((total, data) => total + data.Cost, 0).toFixed(2);

        this.setState(() => ({
          tickValues: this.generateTickValues(formattedData.map(data => data.TimeStamp)),
          data: formattedData.map(data => ({ TimeStamp: data.TimeStamp, Cost: data.Cost })),
          totalCost
        }))
      });
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
            data={this.state.data}
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
                <b>Total Cost Over Period:</b> ${this.state.totalCost} <br/>
                <b>Total Reimbursed Over Period:</b> Not Implemented
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}