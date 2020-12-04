import React from 'react';
import axios from 'axios';
import Graph from './graph';
import { Button, ButtonGroup, Card, CardContent, Grid, Container } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import { compareAsc, format, formatISO, parse, parseISO, subMinutes } from 'date-fns';
import Typography from '@material-ui/core/Typography';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      tickValues: [],
      liveIntervalId: 0,
      offPeakUsage: '',
      peakUsage: '',
      currentInterval: '',
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

  formatData(data, peak, offpeak) {
    const formattedData = [], formattedpeakTime=[], formattedoffpeakTime=[];

    const formats = {
      "pastDay": "HH:mm",
      "pastWeek": "dd/MM/yyyy",
      "pastMonth": "dd/MM/yyyy",
      "pastYear": "LLLL"
    };

    const peakUsageStart = parseISO(peak.starts);
    const formattedpeakUsageStart = format(peakUsageStart, formats[this.state.currentInterval]);

    const peakUsageEnd = parseISO(peak.ends);
    const formattedpeakUsageEnd = format(peakUsageEnd, formats[this.state.currentInterval]);

    const offpeakUsageStart = parseISO(offpeak.starts);
    const formattedoffpeakUsageStart = format(offpeakUsageStart, formats[this.state.currentInterval]);

    const offpeakUsageEnd = parseISO(offpeak.ends);
    const formattedoffpeakUsageEnd = format(offpeakUsageEnd, formats[this.state.currentInterval]);

    this.setState(()=>({
      peakUsage: formattedpeakUsageStart + ' to ' + formattedpeakUsageEnd,
      offPeakUsage: formattedoffpeakUsageStart + ' to ' + formattedoffpeakUsageEnd
    }))

    // loop across the data and change the format of the datas x values
    data.forEach(element => {
      const date = parseISO(element.TimeStamp)
      const formattedDate = format(date, formats[this.state.currentInterval])

      formattedData.push({
        ...element,
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
          peakUsage,
          offPeakUsage
        } = res.data;

        const sortedData = this.sortData(aggregatedData)
        const formattedData = this.formatData(sortedData, peakUsage, offPeakUsage);

        this.setState(() => ({
          tickValues: this.generateTickValues(formattedData.map(data => data.TimeStamp)),
          data: formattedData.map(data => ({ x: data.TimeStamp, y: data.Power })),
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
          <Graph
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
            <Button onClick={() => this.changeInterval("pastDay")}>Past Day</Button>
            <Button disabled startIcon={<DynamicFeedIcon />} onClick={this.liveClick}>Live</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={4} style={{marginRight:"50px"}}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Peak Usage Time = {this.state.peakUsage}
                <br />
                Off Peak Usage Time = {this.state.offPeakUsage}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}


/*
sendRequest() {
    axios.get('/api/murb', {
      params: {
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    })
    .then((res) => {
      this.setState(() => ({
        tickValues: this.generateTickValues(res.data.map(data => data.TimeStamp)),
        data: res.data.map(data => ({x: data.TimeStamp, y: data.Power}))
      }))
    });
  }

sendRequestPastDay() {
    axios.get('/api/murb/pastDay')
    .then((res) => {
      const {
        aggregatedData,
        peakHours,
        offPeakHours
      } = res.data;
      this.setState(() => ({
        tickValues: this.generateTickValues(aggregatedData.map(data => data.TimeStamp)),
        data: aggregatedData.map(data => ({x: data.TimeStamp, y: data.Power})),
        peakHours,
        offPeakHours
      }))
    });
  }

    liveClick() {
    const liveIntervalId = setInterval(() => {
      const endDate = formatISO(new Date());
      const startDate = formatISO(subMinutes(new Date(), 5));
      this.setState(() => ({
        startDate,
        endDate
      }), this.sendRequest)
    }, 300000);

    this.setState(() => ({
      liveIntervalId,
    }))
  }
<Grid item xs={12} spacing={6}>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="Start Date"
                inputVariant="outlined"
                disabled
                value={this.state.startDate}
                onChange={(date) => this.onChangeStartDate(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="End Date"
                inputVariant="outlined"
                disabled
                value={this.state.endDate}
                onChange={(date) => this.onChangeEndDate(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
*/