import { Button, Container, CssBaseline, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { useState } from 'react';
import './App.css';
import MenuIcon from '@material-ui/icons/Menu';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from './components/About';
import Simulation from './components/Simulation/Simulation';
import Financial from './components/EMS/Financial';
import Charger from './components/EMS/EV/Charger';
import MurbEnergy from './components/EMS/MURB/MurbEnergy';
import { grey } from '@material-ui/core/colors';
import { useDispatch } from 'react-redux';
import Notifier from './components/Notifier';
import {
  enqueueSnackbar as enqueueSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from './redux/actions';

const drawerWidth = 280;

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
  appBarSpacer: theme.mixins.toolbar,

}));

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  }

  const menu = () => {
    return(
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
    )
  }
  return (
    <div className="App">
      <Header menu={menu} />
      <Notifier />
      
      <Router>
        <NavDrawer open={open} drawerWidth={drawerWidth} />
        <main className={clsx(classes.content, {[classes.contentShift]: open})}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route path="/MurbEnergy" component={MurbEnergy} />
              <Route path="/Charger" component={Charger} />
              <Route path="/Simulation" component={Simulation} />
              <Route path="/Financial" component={Financial} />
              <Route path="/About" component={About} />
            </Switch>
          </Container>
        </main>

      </Router>
    </div>
  )
}
