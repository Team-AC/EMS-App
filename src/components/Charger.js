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
import { blue, green, lightBlue, red } from '@material-ui/core/colors';
import { compareAsc, format, parseISO } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  lv2: {
    backgroundColor: green[500],
  },
  lv3: {
    backgroundColor: red[500],
  }
}));

export default function Charger() {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const [currentInterval, setCurrentInterval] = useState('pastDay');
  const [aggregatedData, setAggregatedData] = useState([]);
  const [offPeakUsage, setOffPeakUsage] = useState('');
  const [peakUsage, setPeakUsage] = useState('');
  const [liveIntervalId, setLiveIntervalId] = useState(0);

  const [totalPower2, setTotalPower2] = useState([]);
  const [totalPower3, setTotalPower3] = useState([]);

  const [numberOfUsesLv2, setNumberOfUsesLv2] = useState([]);
  const [numberOfUsesLv3, setNumberOfUsesLv3] = useState([]);

  const [avgPowerPerEV2, setAvgPowerPerEV2] = useState([]);
  const [avgPowerPerEV3, setAvgPowerPerEV3] = useState([]);

  const [cardsTransition, setCardsTransition] = useState([]);

  const [numberOfLvTwo, setNumberOfLvTwo] = useState(0);
  const [numberOfLvThree, setNumberOfLvThree] = useState(0);

  // inputs for <Graph />
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [tickValues, setTickValues] = useState([]);


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

  useEffect(() => {
    calcEVPower(aggregatedData);
    displayCards();
  }, [aggregatedData])

  // calculate power consumed 
  const calcEVPower = (data) => {
    // split the data into level 2 chargers and level 3 chargers
    const Lv2Charger = data.filter(element => element.EvChargerType === 2);
    const Lv3Charger = data.filter(element => element.EvChargerType === 3);
    let power2 = 0, power3 = 0;
    let counter2 = 0, counter3 = 0;
    let avgPower2 = 0, avgPower3 = 0;
    for (let i = 0; i < numberOfLvTwo; i++) {
      Lv2Charger.forEach(element => {
        if (element.EvChargerNumber === i) {
          counter2++;
          if (currentInterval === 'pastDay') {
            power2 = power2 + element.Power;
          } else {
            power2 = power2 + element.TotalPower;
          }
        }
      })
      if (power2 != 0 || counter2 != 0) {
        avgPower2 = (power2 / counter2).toFixed(2);
      }
      handleUpdate(i, power2.toFixed(2), setTotalPower2);
      handleUpdate(i, counter2, setNumberOfUsesLv2);
      handleUpdate(i, avgPower2, setAvgPowerPerEV2);
    }

    for (let i = 0; i < numberOfLvThree; i++) {
      Lv3Charger.forEach(element => {
        if (element.EvChargerNumber === i) {
          counter3++;
          if (currentInterval === 'pastDay') {
            power3 = power3 + element.Power;
          } else {
            power3 = power3 + element.TotalPower;
          }
        }
      })
      if (power3 != 0 || counter3 != 0) {
        avgPower3 = (power3 / counter3).toFixed(2);
      }
      handleUpdate(i, power3.toFixed(2), setTotalPower3);
      handleUpdate(i, counter3, setNumberOfUsesLv3);
      handleUpdate(i, avgPower3, setAvgPowerPerEV3);
    }
  }

  const handleUpdate = (index, value, updater) => {
    updater(prevArray => {
      const newArray = [...prevArray];
      newArray[index] = value;
      return newArray;
    })
  }

  

  const displayCards = () => {
    const cards2 = [], cards3 = [];
    if ((numberOfLvTwo >= 1) || (numberOfLvThree >= 1)) {
      let power = totalPower2;
      
      // Level 2 Cards
      for (let i = 0; i < numberOfLvTwo; i++) {
        cards2.push(
          <Grid item xs={3} key={i}>
            <Slide direction="left" in={true} style={{ transitionDelay: `${250*i}ms` }} mountOnEnter unmountOnExit>
              <ExpandedCard
                headerColor={lightBlue[100]}
                media={
                  <Avatar className={classes.lv2}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`2 - Number ${i + 1}`}
                EvInfo={
                  `Power Consumed (kW): ${power[i]}
                  Number of EVs: ${numberOfUsesLv2[i]}
                  Average power per EV (kW): ${avgPowerPerEV2[i]}`
                }
                startDate = {startDate}
                endDate = {endDate}
                data = {data}
                tickValues = {tickValues}
              />
            </Slide>
          </Grid>
        )
      }

      // Level 3 Cards
      for (let j = 0; j < numberOfLvThree; j++) {
        let power = totalPower3;
        cards3.push(
          <Grid item xs={3} key={j}>
            <Slide direction="left" in={true} style={{ transitionDelay: `${250*(j + numberOfLvTwo)}ms` }} mountOnEnter unmountOnExit>
              <ExpandedCard
                headerColor={lightBlue[300]}
                media={
                  <Avatar className={classes.lv3}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`3 - Number ${j + 1}`}
                EvInfo={
                  `Power Consumed (kW): ${power[j]}
                  Number of EVs: ${numberOfUsesLv3[j]}
                  Average power per EV (kW): ${avgPowerPerEV3[j]}`
                }
              />
            </Slide>
          </Grid>
        )
      }
    }
    return [cards2, cards3];
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
      {displayCards()}
    </Grid>
  )
}