import React from 'react';
import axios from 'axios';
import Graph from './graph';
import { Button, ButtonGroup, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import { parseISO } from 'date-fns';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      tickValues: []
    };
  }

  onChangeStartDate(startDate) {
    this.setState(() => ({
      startDate
    }), this.sendRequest);
  }

  onChangeEndDate(endDate) {
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

  generateTickValues(timestamps) {
    const tickValues = [];
    timestamps.forEach((timestamp, index) => {
      if ((index % 5) == 1) tickValues.push(timestamp);
    });
    return tickValues;
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
        
        <Grid item xs={5}>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button>Past Year</Button>
            <Button>Past 3 Months</Button>
            <Button>Past Month</Button>
            <Button>Past Week</Button>
            <Button>Past Day</Button>
            <Button startIcon={<DynamicFeedIcon/>}>Live</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              label="Start Date"
              inputVariant="outlined"
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
              value={this.state.endDate}
              onChange={(date) => this.onChangeEndDate(date)}
            />
          </MuiPickersUtilsProvider>
        </Grid>

      </Grid>
    )
  }
}