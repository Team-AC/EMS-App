import { Container, CssBaseline, makeStyles } from '@material-ui/core';
import React from 'react';
import './App.css';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from './components/About';
import Simulation from './components/Simulation';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    marginLeft: drawerWidth,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    margin: 0,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default () => {
  const classes = useStyles();
  <CssBaseline/>

  return (
    <div className="App">
      <Header/>

      <Router>
          <NavDrawer drawerWidth={drawerWidth}/>

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xl" className={classes.container}>
              <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route path="/Simulation" component={Simulation}/>
                <Route path="/About" component={About}/>
              </Switch>
            </Container>
          </main>

      </Router>
    </div>
  )
}
