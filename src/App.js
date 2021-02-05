import React from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import './App.css';
import { Button, Container, CssBaseline, IconButton, makeStyles } from '@material-ui/core';
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
import { connect, useDispatch, useSelector} from 'react-redux';
import Notifier from './components/Notifier';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
  openHeader,
} from './redux/actions';
import Financial from './components/Design/Financial';

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
    height: 100,
    width: 200,
    background: blue[600],
    boxShadow: blue[600],
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState();
  const headerOpen = useSelector(store => store.header || false);
 
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }
  const openingHeader = () => {
    dispatch(openHeader(true));
  }
  const menu = () => {
    return (
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
    )
  }

  const startButton = () => {
    return(
      <Button onClick={openingHeader} component={Link} to="/Instructions" className={classes.startButton}>Get Started</Button>
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
        <NavDrawer open={drawerOpen} drawerWidth={drawerWidth} />
        <main className={clsx(classes.content, { [classes.contentShift]: drawerOpen })}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Switch>
              <Route exact path="/" render={(props) => (
                <Home {...props} startButton={startButton} />
              )}></Route>
              <Route path="/Instructions" component={Instructions} />
              <Route path="/MurbEnergy" component={MurbEnergy} />
              <Route path="/Charger" component={Charger} />
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
