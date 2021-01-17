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
  let cards = [];
  const classes = useStyles();
  const dispatch = useDispatch();

  const [currentInterval, setCurrentInterval] = useState('pastDay');
  const [offPeakUsage, setOffPeakUsage] = useState('');
  const [peakUsage, setPeakUsage] = useState('');
  const [liveIntervalId, setLiveIntervalId] = useState(0);

  const [totalPower, setTotalPower] = useState(0);
  const [numberOfUses, setNumberOfUses] = useState(0);
  const [avgPowerPerEV, setAvgPowerPerEV] = useState(0);

  const [numberOfLvTwo, setNumberOfLvTwo] = useState(0);
  const [numberOfLvThree, setNumberOfLvThree] = useState(0);

  // inputs for <Graph />
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // tickValues: [],
  // data: [],

  // first render, get number of evs and generate cards
  useEffect(() => {
    checkChargerCount();
  }, [])

  // every render change the information that the card displays
  useEffect(() => {
    sendCurrentRequest(currentInterval);
  }, [currentInterval])

  // get request to set total number of level 2 and 3 chargers 
  const checkChargerCount = () => {
    axios.get(`/api/ev/config`)
      .then((res) => {
        const numLv2 = res.data.numOfEvLevel2;
        const numLv3 = res.data.numOfEvLevel3;
        setNumberOfLvTwo(numLv2);
        setNumberOfLvThree(numLv3);
      })
  }

  const sendCurrentRequest = () => {
    axios.get(`/api/ev/${currentInterval}`)
      .then((res) => {
        const {
          aggregatedData,
          peakUsage,
          offPeakUsage
        } = res.data;

        const sortedData = sortData(aggregatedData);
        const formattedData = formatData(sortedData);
        calcEVPower(aggregatedData)


        setPeakUsage(peakUsage);
        setOffPeakUsage(offPeakUsage);
      })
    .catch((err) => {
      // Implement snackbar
      dispatch(enqueueSnackbar({
        message: `Could not retrieve data for clicked interval`,
        options: {
          variant: 'error',
        },
      }))
    })
  }

  // calculate total number of uses of the EV Charger
  const numberOfVehicles = (data) => {
    let numVehicles = 0;
    data.forEach(element => {
      if (element.EVChargerType === 2) {
        
      }
    })
    return data;
  }

  // calculate power consumed 
  const calcEVPower = (data) => {
    let powerconsumed = 0;
    const vehiclesum = numberOfUses;
    if (currentInterval === 'pastDay'){
    data.forEach(element => {
      powerconsumed = powerconsumed + element.Power;
    })
  } else {
    data.forEach(element => {
      powerconsumed = powerconsumed + element.TotalPower
    })
  }
    setTotalPower(powerconsumed.toFixed(2));
    setNumberOfUses(vehiclesum);
    setAvgPowerPerEV((powerconsumed / vehiclesum).toFixed(2));

    return data;
  }

  // change this when the endpoint gets updated to show number of lv2s and lv3s
  const createCards = () => {
    const cards = [];
    const power = totalPower;
    if ((numberOfLvTwo >= 1) || (numberOfLvThree >= 1)) {
      for (let i = 1; i <= numberOfLvTwo; i++) {
        cards.push(
          <Grid item xs={3}>
            <Fade>
              <ExpandedCard
                media={
                  <Avatar className={classes.lv2}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`2 - Number ${i}`}
                EvInfo={
                  `Power Consumed (kW): ${power}
                  Number of Cars: ${numberOfUses}
                  Average power per EV (kW): ${avgPowerPerEV}`
                }
              />
            </Fade>
          </Grid>
        )
      }
      for (let j = 1; j <= numberOfLvThree; j++) {
        cards.push(
          <Grid item xs={3}>
            <Fade>
              <ExpandedCard
                media={
                  <Avatar className={classes.lv3}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`3 - Number ${j}`}
                EvInfo={
                  `Power Consumed (kW): ${totalPower}
                  Number of Cars: ${numberOfUses}
                  Average power per EV (kW): ${avgPowerPerEV}`
                }
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
    setCurrentInterval(event.currentTarget.value);
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid item xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button value='pastYear' onClick={changeInterval}>Past Year</Button>
          <Button value='past3Months' onClick={changeInterval}>Past 3 Months</Button>
          <Button value='pastMonth' onClick={changeInterval}>Past Month</Button>
          <Button value='pastWeek' onClick={changeInterval}>Past Week</Button>
          <Button value='pastDay' onClick={changeInterval}>Past Day</Button>
        </ButtonGroup>
      </Grid>
      {createCards()}
    </Grid>
  )
}