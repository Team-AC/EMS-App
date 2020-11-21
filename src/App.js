
import { Grid } from '@material-ui/core';
import React from 'react';
import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';
import NavDrawer from './components/NavDrawer';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from './About';

export default () => (
  <div className="App">
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Header/>
      </Grid>
      
      <Grid item>
        <Grid container direction="row">
          <Router>
            <Grid item xs={2}>
              <NavDrawer/>
            </Grid>
            <Grid item xs={10}>
              <Switch>
                <Route exact path = "/Home">
                  <Home/>
                </Route>
                <Route path = "/About" component={About}/>
              </Switch>
            </Grid>
          </Router>
        </Grid>
      </Grid>
    </Grid>
  </div>
);
