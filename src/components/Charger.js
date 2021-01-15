import axios from 'axios';
import { Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import EVGraph from './EVGraph';
import ExpandedCard from './ExpandedCard';
import { compareAsc, format,  parseISO,  } from 'date-fns';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import React from 'react';
import { enqueueSnackbar, ENQUEUE_SNACKBAR } from '../redux/actions';
import { connect } from 'react-redux'

class Charger extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      tickValues: [],
      liveIntervalId: 0,
      offPeakUsage: '',
      peakUsage: '',
      currentInterval: '',
      totalPower: 0,
      numberOfEVs: 0,
      avgPowerPerEV: 0,
    }
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

  calcEVPower(data) {
    let powerconsumed = 0;
    const vehiclesum = data.length;

    data.forEach(element => {
      powerconsumed = powerconsumed + element.Power;
    })
    
    this.setState(() => ({
      totalPower: powerconsumed.toFixed(2),
      numberOfEVs: vehiclesum,
      avgPowerPerEV: (powerconsumed/vehiclesum).toFixed(2),
    }))
    return data;
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
    axios.get(`/api/ev/${this.state.currentInterval}`)
      .then((res) => {
        const {
          aggregatedData,
          peakUsage,
          offPeakUsage
        } = res.data;
        
        if (aggregatedData.length > 2) {

          const sortedData = this.sortData(aggregatedData)
          const formattedData = this.formatData(sortedData, peakUsage, offPeakUsage);
          this.calcEVPower(aggregatedData);

          this.setState(() => ({
            tickValues: this.generateTickValues(formattedData.map(data => data.TimeStamp)),
            data: formattedData.map(data => ({ x: data.TimeStamp, y: data.Power })),
          }))
        } else {
          throw "Error: not enough data points"
        }
      });
      // .catch((err) => {
      //   this.props.dispatching()
      // });
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={() => this.changeInterval("pastYear")}>Past Year</Button>
            <Button onClick={() => this.changeInterval("past3Months")}>Past 3 Months</Button>
            <Button onClick={() => this.changeInterval("pastMonth")}>Past Month</Button>
            <Button onClick={() => this.changeInterval("pastWeek")}>Past Week</Button>
            <Button onClick={() => this.changeInterval("pastDay")}>Past Day</Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ExpandedCard
            subheader={'Level 2 - Number One'}
            avgpower={'Power Consumed (kW): ' + this.state.totalPower}
            numcars={'Number of Cars: ' + this.state.numberOfEVs}
            avgcarpower={'Average power per car (kW): ' + this.state.avgPowerPerEV}      
          />
        </Grid>
      </Grid>
    )
  }
}

const dispatching = () => ({ type: ENQUEUE_SNACKBAR });
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

export default connect(null, mapDispatchToProps)(Charger)