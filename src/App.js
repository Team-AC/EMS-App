
import { Grid } from '@material-ui/core';
import React from 'react';
import './App.css';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Header from './components/Header';

export default () => (
  <div className="App">
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Header/>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item xs={2}>
            <NavDrawer/>
          </Grid>
          <Grid item xs={10}>
            <Home/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);
