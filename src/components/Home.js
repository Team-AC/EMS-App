import React from 'react';
import axios from 'axios';
import Graph from './graph';
import { Button, ButtonGroup, Card, CardContent, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import { formatISO, parseISO, subMinutes } from 'date-fns';
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
      offPeakHours: '',
      peakHours: '',
    };

    this.liveClick = this.liveClick.bind(this);
    this.pastDayClick = this.pastDayClick.bind(this);
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

  generateTickValues(timestamps) {
    const tickValues = [];
    timestamps.forEach((timestamp, index) => {
      if ((index % 5) == 1) tickValues.push(timestamp);
    });
    return tickValues;
  }

  pastDayClick() {
    this.stopLive();
    this.sendRequestPastDay();
  }

  liveClick() {
    const liveIntervalId = setInterval(() => {
      const endDate = formatISO(new Date());
      const startDate = formatISO(subMinutes(new Date(), 5));
      this.setState(() => ({
        startDate,
        endDate
      }), this.sendRequest)
    }, 3000);

    this.setState(() => ({
      liveIntervalId,
    }))
  }

  stopLive() {
    clearInterval(this.state.liveIntervalId);
  }

  render() {
    return (
        <Grid container direction="column" spacing={6}>
          <Grid style={{"margin-bottom": "10px"}} item xs={12}>
            <Graph
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              data={this.state.data}
              tickValues={this.state.tickValues}
            />
          </Grid>
          
          <Grid container direction = "row" spacing = {3}>
            <Grid item xs = {5} style ={{marginLeft: "60px"}}>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button>Past Year</Button>
                <Button>Past 3 Months</Button>
                <Button>Past Month</Button>
                <Button>Past Week</Button>
                <Button onClick={this.pastDayClick}>Past Day</Button>
                <Button startIcon={<DynamicFeedIcon/>} onClick={this.liveClick}>Live</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs = {5}>
              <Card style = {{marginLeft: "300px"}}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    On Peak Hours = {this.state.peakHours}
                    <br/>
                    Off Peak Hours = {this.state.offPeakHours}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={3} style = {{marginLeft: "30px"}}>
            <Grid item xs={2}>
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

            <Grid item xs={2}>
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
        </Grid>
    )
  }
}