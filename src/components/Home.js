import React from 'react';
import axios from 'axios';
import Graph from './graph';
import { Button, ButtonGroup, Card, CardContent, Grid, Container } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import { compareAsc, format, formatISO, parse, parseISO, subMinutes } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar, ENQUEUE_SNACKBAR } from '../redux/actions';
import { connect } from 'react-redux'

class Home extends React.Component  {
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
    const formattedData = []

    const formats = {
      "pastDay": "HH:mm",
      "pastWeek": "EEEE",
      "pastMonth": "dd/MM/yyyy",
      "pastYear": "LLLL"
    };

    if (peak && offpeak){
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
    }

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

        if (aggregatedData.length > 2) {

        const sortedData = this.sortData(aggregatedData)
        const formattedData = this.formatData(sortedData, peakUsage, offPeakUsage);

        this.setState(() => ({
          tickValues: this.generateTickValues(formattedData.map(data => data.TimeStamp)),
          data: formattedData.map(data => ({ x: data.TimeStamp, y: data.Power })),
        }))
        } else {
          throw "Error: not enough data points"
        }
      })
      .catch((err) => {
       this.props.dispatching()
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
              <Typography color="textSecondary" style={{textAlign: 'left'}} gutterBottom>
                <b>Peak Usage Time:</b> {this.state.peakUsage}
                <br />
                <b>Off Peak Usage Time:</b> {this.state.offPeakUsage}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

const dispatching = () => ({ type: ENQUEUE_SNACKBAR});
const mapDispatchToProps = dispatch => {
  return {
    dispatching: () => dispatch(enqueueSnackbar({
      message: 'Could not retrieve data for clicked interval',
      options: {
        variant: 'error',
      }
    })),
  }
}

export default connect(null, mapDispatchToProps)(Home)