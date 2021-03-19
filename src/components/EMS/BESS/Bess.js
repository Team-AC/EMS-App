import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
//import BessPie from './BessPie';
//import EvPie from './EvPie';

export default function Bess() {
  const [dataInterval, setDataInterval] = useState('pastDay')
  const [data, setData] = useState([]);

  useEffect(() => {
    sendRequest(dataInterval);
  }, [dataInterval])

  const sendRequest = (e) => {
    axios.get(`/api/bess/energy`,)
      .then(res => {
        const interval = res.data[e]

        setData(
          interval.bess.ev,
          interval.bess.arbitrage,
          interval.bess.load,
          interval.grid.ev,
        )
      })
  }

  return (
    <Grid container spacing={3}>
      <Typography> testing{data} </Typography>
    </Grid>
  )
}