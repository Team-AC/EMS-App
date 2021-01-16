import axios from 'axios';
import { Button, ButtonGroup, Fade, Grid, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import React from 'react';
import EVGraph from './EVGraph';
import ExpandedCard from './ExpandedCard';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../redux/actions';
import Avatar from '@material-ui/core/Avatar';
import PowerIcon from '@material-ui/icons/Power';
import { green, red } from '@material-ui/core/colors';
import { compareAsc, format, parseISO } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  lv2: {
    backgroundColor: red[500],
  },
  lv3: {
    backgroundColor: green[500],
  }
}));

export default function Charger() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentInterval, setCurrentInterval] = useState('pastDay');
  const [offPeakUsage, setOffPeakUsage] = useState('');
  const [peakUsage, setPeakUsage] = useState('');
  const [liveIntervalId, setLiveIntervalId] = useState(0);

  const [totalPower, setTotalPower] = useState(0);
  const [numberOfLvTwo, setNumberOfLvTwo] = useState(0);
  const [numberOfLvThree, setNumberOfLvThree] = useState(0);
  const [avgPowerPerEV, setAvgPowerPerEV] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // tickValues: [],
  // data: [],

  // first render, get number of evs and generate cards
  useEffect(() => {
    checkChargerCount();
    sendCurrentRequest(currentInterval);
  }, [])

  useEffect(() => {
    // use pastDay function
    if (currentInterval === 'pastDay') {
      checkChargerCount();
    } else {
      // use sendCurrentRequest
      sendCurrentRequest(currentInterval);
    }
  }, [currentInterval])

  // change this when the endpoint gets updated to show number of lv2s and lv3s
  const checkChargerCount = () => {
    axios.get(`/api/ev/config`)
      .then((res) => {
        const numLv2 = res.data.numOfEvLevel2;
        const numLv3 = res.data.numOfEvLevel3;
        setNumberOfLvTwo(numLv2);
        setNumberOfLvThree(numLv3);
      })
  }
  // for pastDay interval calculate power consumed, number of EVs, average power per EV
  // change this to check which charger is running
  
  const sendCurrentRequest = () => {
    axios.get(`/api/ev/${currentInterval}`)
      .then((res) => {
        const {
          aggregatedData,
          peakUsage,
          offPeakUsage
        } = res.data;

        // sort the data
        // format the data
        // calculate power
      })
    // .catch((err) => {
    //   // Implement snackbar
    //   dispatch(enqueueSnackbar({
    //     message: `Could not retrieve data for clicked interval`,
    //     options: {
    //       variant: 'error',
    //     },
    //   }))
    // })
  }

  const calcEVPower = (data) => {
    let powerconsumedlv2 = 0, powerconsumedlv3 = 0;
    const vehiclesum = data.length;

    data.forEach(element => {
      // level 2 power consumption calculation
      if (element.EVChargerType === 2) {
        powerconsumedlv2 = powerconsumedlv2 + element.Power;
      } else {
        // level 3 power consumption calculation
        powerconsumedlv3 = powerconsumedlv3 + element.Power;
      }
    })

    this.setState(() => ({
      totalPower: powerconsumedlv2.toFixed(2),
      numberOfEVs: vehiclesum,
      avgPowerPerEV: (powerconsumedlv2 / vehiclesum).toFixed(2),
    }))

    return data;
  }

  // change this when the endpoint gets updated to show number of lv2s and lv3s
  const createCards = () => {
    const cards = [];
    if ((numberOfLvTwo >= 1) || (numberOfLvThree >= 1)) {
      for (let i = 0; i < numberOfLvTwo; i++) {
        cards.push(
          <Grid item xs={3}>
            <Fade>
            <ExpandedCard
              media={
                <Avatar className={classes.lv2}>
                  <PowerIcon />
                </Avatar>
              }
              subheader={`2 - Number ${i + 1}`}
              avgpower={'Power Consumed (kW): ' + totalPower}
              numcars={'Number of Cars: ' + numberOfLvTwo}
              avgcarpower={'Average power per car (kW): ' + avgPowerPerEV}
            />
            </Fade>
          </Grid>
        )
      }
      for (let j = 0; j < numberOfLvThree; j++) {
        cards.push(
          <Grid item xs={3}>
            <Fade>
            <ExpandedCard
              media={
                <Avatar className={classes.lv3}>
                  <PowerIcon />
                </Avatar>
              }
              subheader={`3 - Number ${j + 1}`}
              avgpower={'Power Consumed (kW): ' + totalPower}
              numcars={'Number of Cars: ' + numberOfLvThree}
              avgcarpower={'Average power per car (kW): ' + avgPowerPerEV}
            />
            </Fade>
          </Grid>
        )
      }
    }
    return cards;
  }

  const sortData = (data) => {
    return data.sort((dataLeft, dataRight) => compareAsc(parseISO(dataLeft.TimeStamp), parseISO(dataRight.TimeStamp)));
  }

  const formatData = (data, peak, offpeak) => {
    const formattedData = [];

    const formats = {
      "pastDay": "HH:mm",
      "pastWeek": "EEEE",
      "pastMonth": "dd/MM/yyyy",
      "pastYear": "LLLL"
    };

    if (peak && offpeak) {
      const peakUsageStart = parseISO(peak.starts);
      const formattedpeakUsageStart = format(peakUsageStart, formats[this.state.currentInterval]);

      const peakUsageEnd = parseISO(peak.ends);
      const formattedpeakUsageEnd = format(peakUsageEnd, formats[this.state.currentInterval]);

      const offpeakUsageStart = parseISO(offpeak.starts);
      const formattedoffpeakUsageStart = format(offpeakUsageStart, formats[this.state.currentInterval]);

      const offpeakUsageEnd = parseISO(offpeak.ends);
      const formattedoffpeakUsageEnd = format(offpeakUsageEnd, formats[this.state.currentInterval]);

      setPeakUsage(formattedpeakUsageStart + ' to ' + formattedpeakUsageEnd);
      setOffPeakUsage(formattedoffpeakUsageStart + ' to ' + formattedoffpeakUsageEnd);
    }
  }

  const changeInterval = (event) => {
    // setCurrentInterval(event.target.value);
    // sendCurrentRequest(currentInterval);
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button onClick={changeInterval("pastYear")}>Past Year</Button>
          <Button onClick={changeInterval("past3Months")}>Past 3 Months</Button>
          <Button onClick={changeInterval("pastMonth")}>Past Month</Button>
          <Button onClick={changeInterval("pastWeek")}>Past Week</Button>
          <Button onClick={changeInterval("pastDay")}>Past Day</Button>
        </ButtonGroup>
      </Grid>
      {createCards()}
    </Grid>
  )
}