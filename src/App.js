import React from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import './App.css';
import { Button, Container, CssBaseline, Drawer, IconButton, makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Header from './components/Header';
import About from './components/About';
import Simulation from './components/Simulation/Simulation';
import Billing from './components/EMS/Billing';
import Charger from './components/EMS/EV/Charger';
import MurbEnergy from './components/EMS/MURB/MurbEnergy';
import Instructions from './components/Instructions';
import { blue, grey } from '@material-ui/core/colors';
import { useDispatch, useSelector} from 'react-redux';
import Notifier from './components/Notifier';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
  openHeader,
  toggleDrawer,
} from './redux/actions';
import Financial from './components/Design/Financial';
import Bess from './components/EMS/BESS/Bess';

const drawerWidth = 280;
const headerHeight = 64;

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    marginLeft: 0,
    height: '100vh',
    overflow: 'auto',
    background: grey[100],
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    margin: 0,
  },
  contentShift: {
    marginLeft: drawerWidth,
  },
  topContainer: {
    margin: 0,
  },
  topShift: {
    marginTop: headerHeight,
  },
  startButton: {
    height: 50,
    width: 200,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawer = useSelector(store => store.drawer);
  const headerOpen = useSelector(store => store.header || false);
 
  const drawerToggle = () => {
    dispatch(toggleDrawer());
  }
  const openingHeader = () => {
    drawerToggle();
    dispatch(openHeader(true));
  }

  const menu = () => {
    return (
      <IconButton color="inherit" onClick={drawerToggle}>
        <MenuIcon />
      </IconButton>
    )
  }

  const startButton = () => {
    return(
      <Button variant="contained" color="primary" onClick={openingHeader} component={Link} to="/Instructions" className={classes.startButton}>Get Started</Button>
    )
  }
  const header = () => {
    if (!headerOpen) {
      return null;
    } else {
      return (
        <Header menu={menu} headerHeight={headerHeight} />
      )
    }
  }
  return (
    <div className="App">
      <Notifier />

      <Router>
        {header()}
        <NavDrawer drawerWidth={drawerWidth} />
        <main className={clsx(classes.content, { [classes.contentShift]: drawer })}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Switch>
              <Route exact path="/" render={(props) => (
                <Home {...props} startButton={startButton} />
              )}></Route>
              <Route path="/Instructions" component={Instructions} />
              <Route path="/MurbEnergy" component={MurbEnergy} />
              <Route path="/Charger" component={Charger} />
              <Route path="/Bess" component={Bess} />
              <Route path="/Financial" component={Financial} />
              <Route path="/Simulation" component={Simulation} />
              <Route path="/Billing" component={Billing} />
              <Route path="/About" component={About} />
            </Switch>
          </Container>
        </main>

      </Router>
    </div>
  )
}
