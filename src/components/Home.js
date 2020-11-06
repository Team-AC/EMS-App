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
      endDate: new Date()
    };
  }

  onChange(date) {
    console.log(date);
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Graph/>
        </Grid>

        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              label="Start Date"
              inputVariant="outlined"
              value={this.state.startDate}
              onChange={this.onChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              label="End Date"
              inputVariant="outlined"
              value={this.state.endDate}
              onChange={this.onChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>

      </Grid>
    )
  }
}