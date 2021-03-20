import { Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import BessPie from './BessPie';

export default function Bess() {
  const [dataInterval, setDataInterval] = useState('pastDay')
  const [data, setData] = useState([]);
  useEffect(() => {
    sendRequest(dataInterval);
  }, [])

  const sendRequest = (e) => {
    axios.get(`/api/bess/energy`,)
      .then(res => {
        const interval = res.data[e]
        const tempData = [
          {
            "id": "Bess Ev Charging",
            "label": "Bess Ev Charging",
            "value": interval.bess.ev,
          },
          {
            "id": "Bess Arbitrage",
            "label": "Bess Arbitrage",
            "value": interval.bess.arbitrage,
          },
          {
            "id": "Bess Load Shedding",
            "label": "Bess Load Shedding",
            "value": interval.bess.load,
          },
          {
            "id": "Grid Ev Charging",
            "label": "Grid Ev Charging",
            "value": interval.grid.ev,
          },   
        ]
        setData(
          tempData
        )
      })
  }

  const changeInterval = (event) => {
    setDataInterval(event.currentTarget.value);
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BessPie data={data} />
      </Grid>
      <Grid item xs={12}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button value='pastYear' onClick={changeInterval}>Past Year</Button>
          <Button value='past3Months' onClick={changeInterval}>Past 3 Months</Button>
          <Button value='pastMonth' onClick={changeInterval}>Past Month</Button>
          <Button value='pastWeek' onClick={changeInterval}>Past Week</Button>
          <Button value='pastDay' onClick={changeInterval}>Past Day</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}