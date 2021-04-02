import { Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import BessPie from './BessPie';
import EvPie from './GridPie';

export default function Bess() {
  const [dataInterval, setDataInterval] = useState('pastWeek')
  const [bessData, setBessData] = useState([]);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    sendRequest(dataInterval);
  }, [dataInterval])

  const sendRequest = (e) => {
    axios.get(`/api/bess/energy`,)
      .then(res => {
        const interval = res.data[e]
        const tempBessData = [
          {
            "id": "Bess Ev Charging",
            "label": "Bess Ev Charging",
            "value": interval.bess.ev.toFixed(2),
          },
          {
            "id": "Bess Arbitrage",
            "label": "Bess Arbitrage",
            "value": interval.bess.arbitrage.toFixed(2),
          },
          {
            "id": "Bess Load Shedding",
            "label": "Bess Load Shedding",
            "value": interval.bess.load.toFixed(2),
          },
        ]
        const tempGridData = [
          {
            "id": "Bess Ev Charging",
            "label": "Bess Ev Charging",
            "value": interval.bess.ev.toFixed(2),
          }, 
          {
            "id": "Grid Ev Charging",
            "label": "Grid Ev Charging",
            "value": interval.grid.ev.toFixed(2),
          },   
        ]
        setBessData(tempBessData)
        setGridData(tempGridData)
      })
  }

  const changeInterval = (event) => {
    setDataInterval(event.currentTarget.value);
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <BessPie data={bessData} />
      </Grid>
      <Grid item xs={6}>
        <EvPie data={gridData} />
      </Grid>
      <Grid item xs={12}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button value='pastYear' onClick={changeInterval}>Past Year</Button>
          <Button value='past3Months' onClick={changeInterval}>Past 3 Months</Button>
          <Button value='pastMonth' onClick={changeInterval}>Past Month</Button>
          <Button value='pastWeek' onClick={changeInterval}>Past Week</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}