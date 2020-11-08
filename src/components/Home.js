import React from 'react';
import axios from 'axios';
import Graph from './graph';
import { Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      data: []
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
        data: res.data.map(data => ({x: data.TimeStamp, y: data.Power}))
      }))
    });
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Graph
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            data={this.state.data}
          />
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