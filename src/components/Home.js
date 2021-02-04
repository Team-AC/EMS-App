import { Button, Card, CardMedia, Grid, makeStyles, Typography } from '@material-ui/core';
import { amber, blue, deepOrange, green, grey, purple, red } from '@material-ui/core/colors';
import React from 'react';
import Ev from '../images/HomeEv.png';
import Murb from '../images/Murb.png';

const useStyles = makeStyles({
  startButton: {
    height: 100,
    width: 200,
    background: blue[600],
    boxShadow: blue[600],
  },
});
export default function Home() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid item direction="column" xs="7">

          <Typography variant="h1" style={{ 'color': grey[900], textAlign: 'left' }}> Welcome to the future of <br />Energy Management</Typography>

          <Grid item xs="7">

            <br /><br /><br /><br />
            <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 1. <span style={{ 'color': deepOrange[500] }}>Design</span> your system </Typography>
            <br />
            <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 2. <span style={{ 'color': green[500] }}>Simulate</span> your system </Typography>
            <br />
            <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 3. <span style={{ 'color': blue[500] }}>See</span> the EMS in action </Typography>

            <br /><br />
            <Grid xs="5">
              <Button onClick={} className={classes.startButton}>Get Started</Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs="5">
          <img src={Murb} style={{ width: "40vw" }} alt="Buildings" />
          <img src={Ev} style={{ width: "40vw" }} alt="Electric Vehicle" />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}