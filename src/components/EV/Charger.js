import axios from 'axios';
import { Button, ButtonGroup, Fade, Grid, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import React from 'react';
import EVGraph from './EVGraph';
import ExpandedCard from './ExpandedCard';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../redux/actions';
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
  const [totalCost2, setTotalCost2] = useState([]);
  const [totalCost3, setTotalCost3] = useState([]);
  const [usageTime2, setUsageTime2] = useState([]);
  const [usageTime3, setUsageTime3] = useState([]);
  const [avgUsageTime2, setAvgUsageTime2] = useState([]);
  const [avgUsageTime3, setAvgUsageTime3] = useState([]);

  const [numberOfLv2, setNumberOfLv2] = useState(0);
  const [numberOfLv3, setNumberOfLv3] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());

  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [tickValues2, setTickValues2] = useState([]);
  const [tickValues3, setTickValues3] = useState([]);


  useEffect(() => {
    checkChargerCount();
  }, [numberOfLv2, numberOfLv3])

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
        setNumberOfLv2(parseInt(numLv2));
        setNumberOfLv3(parseInt(numLv3));
      })
  }

  const sendCurrentRequest = () => {
    axios.get(`/api/ev/${currentInterval}`)
      .then((res) => {
        const {
          aggregatedData,
          offPeakUsage,
          peakUsage,

        } = res.data;

        const sortedData = sortData(aggregatedData);
        const formattedData = formatData(sortedData, peakUsage, offPeakUsage);

        setAggregatedData(formattedData);

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
    let cost2 = 0, cost3 = 0;
    let chargeTime2 = 0, chargeTime3 = 0;
    let avgChargeTime2 = 0, avgChargeTime3 = 0;
    let ticks2 = [], ticks3 = [];
    let data2 = [], data3 = [];
    for (let i = 0; i < numberOfLv2; i++) {
      ticks2 = [];
      data2 = [];
      Lv2Charger.forEach(element => {
        if (element.EvChargerNumber === i) {
          counter2++;
          cost2 = cost2 + element.Cost
          if (currentInterval === 'pastDay') {
            power2 = power2 + element.Power;
            chargeTime2 = chargeTime2 + element.ChargeTime;
          } else {
            power2 = power2 + element.TotalPower;
            chargeTime2 = chargeTime2 + element.TotalChargeTime;
            ticks2.push(element.TimeStamp);
            data2.push({ x: element.TimeStamp, y: element.TotalPower })
          }
        }
      })
      if (power2 != 0 || counter2 != 0) {
        avgPower2 = (power2 / counter2).toFixed(2);
        avgChargeTime2 = (chargeTime2 / counter2).toFixed(2);
        generateTickValues(ticks2);
      }
      handleUpdate(i, power2.toFixed(2), setTotalPower2);
      handleUpdate(i, counter2, setNumberOfUsesLv2);
      handleUpdate(i, avgPower2, setAvgPowerPerEV2);
      handleUpdate(i, cost2.toFixed(2), setTotalCost2);
      handleUpdate(i, chargeTime2.toFixed(2), setUsageTime2);
      handleUpdate(i, avgChargeTime2, setAvgUsageTime2);
      handleUpdate(i, ticks2, setTickValues2);
      handleUpdate(i, data2, setData2);
    }

    for (let i = 0; i < numberOfLv3; i++) {
      ticks3 = [];
      data3 = []
      Lv3Charger.forEach(element => {
        if (element.EvChargerNumber === i) {
          counter3++;
          cost3 = cost3 + element.Cost;
          if (currentInterval === 'pastDay') {
            power3 = power3 + element.Power;
            chargeTime3 = chargeTime3 + element.ChargeTime;
          } else {
            power3 = power3 + element.TotalPower;
            chargeTime3 = chargeTime3 + element.TotalChargeTime;
            ticks3.push(element.TimeStamp);
            data3.push({ x: element.TimeStamp, y: element.TotalPower })
          }
        }
      })
      if (power3 != 0 || counter3 != 0) {
        avgPower3 = (power3 / counter3).toFixed(2);
        avgChargeTime3 = (chargeTime3 / counter3).toFixed(2);
        generateTickValues(ticks3);
      }
      handleUpdate(i, power3.toFixed(2), setTotalPower3);
      handleUpdate(i, counter3, setNumberOfUsesLv3);
      handleUpdate(i, avgPower3, setAvgPowerPerEV3);
      handleUpdate(i, cost3.toFixed(2), setTotalCost3);
      handleUpdate(i, chargeTime3.toFixed(2), setUsageTime3);
      handleUpdate(i, avgChargeTime3, setAvgUsageTime3);
      handleUpdate(i, ticks3, setTickValues3);
      handleUpdate(i, data3, setData3);
    }
  }

  const handleUpdate = (index, value, updater) => {
    updater(prevArray => {
      const newArray = [...prevArray];
      newArray[index] = value;
      return newArray;
    })
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
      const formattedpeakUsageStart = format(peakUsageStart, formats[currentInterval]);

      const peakUsageEnd = parseISO(peak.ends);
      const formattedpeakUsageEnd = format(peakUsageEnd, formats[currentInterval]);

      const offpeakUsageStart = parseISO(offpeak.starts);
      const formattedoffpeakUsageStart = format(offpeakUsageStart, formats[currentInterval]);

      const offpeakUsageEnd = parseISO(offpeak.ends);
      const formattedoffpeakUsageEnd = format(offpeakUsageEnd, formats[currentInterval]);

      setPeakUsage(`${formattedpeakUsageStart} to ${formattedpeakUsageEnd}`);
      setOffPeakUsage(`${formattedoffpeakUsageStart} to ${formattedoffpeakUsageEnd}`);
    }
    // loop across the data and change the format of the datas x values
    data.forEach(element => {
      const date = parseISO(element.TimeStamp)
      const formattedDate = format(date, formats[currentInterval])

      formattedData.push({
        ...element,
        TimeStamp: formattedDate
      })
    })
    return formattedData;
  }

  const generateTickValues = (timestamps) => {
    const tickValues = [];
    timestamps.forEach((timestamp, index) => {
      if ((index % 5) == 1) tickValues.push(timestamp);
    });
    return tickValues;
  }

  const displayCards = () => {
    const cards2 = [], cards3 = [];
    if ((numberOfLv2 >= 1) || (numberOfLv3 >= 1)) {
      for (let i = 0; i < numberOfLv2; i++) {
        cards2.push(
          <Grid item xs={3} key={i}>
            <Fade>
              <ExpandedCard
                headerColor={lightBlue[100]}
                media={
                  <Avatar className={classes.lv2}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`2 - Number ${i + 1}`}
                evInfo={
                  <span>
                    <b>Power Consumed (kW):</b> {totalPower2[i]} <br />
                    <b>Number of EVs:</b> {numberOfUsesLv2[i]} <br />
                    <b>Average power per EV (kW):</b> {avgPowerPerEV2[i]} <br />
                    <b>Cost ($):</b> {totalCost2[i]} <br />
                    <b>Total Usage Time (h):</b> {usageTime2[i]} <br />
                    <b>Average Usage Time per EV (h):</b> {avgUsageTime2[i]} <br />
                  </span>
                }
                startDate={startDate}
                endDate={endDate}
                data={data2[i]}
                tickValues={tickValues2[i]}
              />
            </Fade>
          </Grid>
        )
      }
      for (let i = 0; i < numberOfLv3; i++) {
        cards3.push(
          <Grid item xs={3} key={i}>
            <Fade>
              <ExpandedCard
                headerColor={lightBlue[300]}
                media={
                  <Avatar className={classes.lv3}>
                    <PowerIcon />
                  </Avatar>
                }
                subheader={`3 - Number ${i + 1}`}
                evInfo={
                  <span>
                    <b>Power Consumed (kW):</b> {totalPower3[i]} <br />
                    <b>Number of EVs:</b> {numberOfUsesLv3[i]} <br />
                    <b>Average power per EV (kW):</b> {avgPowerPerEV3[i]} <br />
                    <b>Cost ($):</b> {totalCost3[i]} <br />
                    <b>Total Usage Time (h):</b> {usageTime3[i]} <br />
                    <b>Average Usage Time per EV (h):</b> {avgUsageTime3[i]} <br />
                  </span>
                }
                startDate={startDate}
                endDate={endDate}
                data={data3[i]}
                tickValues={tickValues3[i]}
              />
            </Fade>
          </Grid>
        )
      }
    }
    return [cards2, cards3];
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