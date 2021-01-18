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

  const cards = [];
  const [currentInterval, setCurrentInterval] = useState('');
  const [aggregatedData, setAggregatedData] = useState([]);
  const [offPeakUsage, setOffPeakUsage] = useState('');
  const [peakUsage, setPeakUsage] = useState('');
  const [liveIntervalId, setLiveIntervalId] = useState(0);

  const [totalPower2] = useState([]);
  const [totalPower3] = useState([]);

  const [numberOfUsesLv2, setNumberOfUsesLv2] = useState([]);
  const [numberOfUsesLv3, setNumberOfUsesLv3] = useState([]);

  const [avgPowerPerEV2, setAvgPowerPerEV2] = useState([]);
  const [avgPowerPerEV3, setAvgPowerPerEV3] = useState([]);


  const [numberOfLvTwo, setNumberOfLvTwo] = useState(0);
  const [numberOfLvThree, setNumberOfLvThree] = useState(0);

  // inputs for <Graph />
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // tickValues: [],
  // data: [],

  useEffect(() => {
    checkChargerCount();
  }, [numberOfLvTwo, numberOfLvThree])

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
        setNumberOfLvTwo(parseInt(numLv2));
        setNumberOfLvThree(parseInt(numLv3));
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
        setAggregatedData(aggregatedData);
      })
      .catch((err) => {
        // Implement snackbar
        // dispatch(enqueueSnackbar({
        //   message: `Could not retrieve data for clicked interval`,
        //   options: {
        //     variant: 'error',
        //   },
        // }))
      })
  }

  // calculate total number of uses of the EV Charger
  const numberOfVehicles = (data) => {
    let numVehicles = 0;
    const Lv2Charger = data.filter(element => element.EvChargerType == 2);
    const Lv3Charger = data.filter(element => element.EvChargerType == 3);

    data.forEach(element => {
      if (element.EVChargerType === 2) {

      }
    })
    return data;
  }

  useEffect(() => {
    calcEVPower(aggregatedData);
  }, [aggregatedData])
  
  // calculate power consumed 
  const calcEVPower = (data) => {
    // split the data into level 2 chargers and level 3 chargers
    const Lv2Charger = data.filter(element => element.EvChargerType === 2);
    const Lv3Charger = data.filter(element => element.EvChargerType === 3);
 
    if (currentInterval === 'pastDay') {
      // loop across the Level 2 chargers and calculate the total power consumed by each individual charger  
      for (let i = 0; i < numberOfLvTwo; i++) {
        let power2 = 0;
        let counter = 0;
        Lv2Charger.forEach(element => {
          // add the element's Power to the sum
          if (element.EvChargerNumber === i) {
            power2 = power2 + element.Power;
            counter++;
          }
        })
        totalPower2[i] = power2.toFixed(2);
        numberOfUsesLv2[i] = counter;
        avgPowerPerEV2[i] = (power2/counter).toFixed(2);
      }
      for (let j = 0; j < numberOfLvThree; j++) {
        let power3 = 0;
        let counter = 0;
        Lv3Charger.forEach(element => {
          // add the element's Power to the sum
          if (element.EvChargerNumber === j) {
            power3 = power3 + element.Power;
            counter++;
          }
        })
        totalPower3[j] = power3.toFixed(2);
        numberOfUsesLv3[j] = counter;
        avgPowerPerEV3[j] = (power3/counter).toFixed(2);
      }
    } else {
      for (let i = 0; i < numberOfLvTwo; i++) {
        let power2 = 0;
        let counter = 0;
        Lv2Charger.forEach(element => {
          // add the element's Power to the sum
          if (element.EvChargerNumber === i) {
            power2 = power2 + element.TotalPower;
            counter++;
          }
        })
        totalPower2[i] = power2.toFixed(2);
        numberOfUsesLv2[i] = counter;
        avgPowerPerEV2[i] = (power2/counter).toFixed(2);
      }
      for (let j = 0; j < numberOfLvThree; j++) {
        let power3 = 0;
        let counter = 0;
        Lv3Charger.forEach(element => {
          // add the element's Power to the sum
          if (element.EvChargerNumber === j) {
            power3 = power3 + element.TotalPower;
            counter++;
          }
        })
        totalPower3[j] = power3.toFixed(2);
        numberOfUsesLv3[j] = counter;
        avgPowerPerEV3[j] = (power3/counter).toFixed(2);
      }
    }
  }

  useEffect (() => {
    displayCards();
  }, [totalPower2, totalPower3])

  const displayCards = () => {
    if ((numberOfLvTwo >= 1) || (numberOfLvThree >= 1)) {
      let power = totalPower2;
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
                EvInfo={
                  `Power Consumed (kW): ${power[i]}
                  Number of Cars: ${numberOfUsesLv2[i]}
                  Average power per EV (kW): ${avgPowerPerEV2[i]}`
                }
              />
            </Fade>
          </Grid>
        )
      }
      for (let j = 0; j < numberOfLvThree; j++) {
        let power = totalPower3;
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
                EvInfo={
                  `Power Consumed (kW): ${power[j]}
                  Number of Cars: ${numberOfUsesLv3[j]}
                  Average power per EV (kW): ${avgPowerPerEV3[j]}`
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
    console.log(cards),
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
      {displayCards()}
    </Grid>
  )
}