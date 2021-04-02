import { Button, Card, CardMedia, Grid, makeStyles, Typography, Slide, Fade } from '@material-ui/core';
import { amber, blue, deepOrange, green, grey, purple, red } from '@material-ui/core/colors';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Ev from '../images/HomeEv.png';
import Murb from '../images/Murb.png';

const useStyles = makeStyles({
  
});
export default function Home(props) {
  const classes = useStyles();
  const [transitions, setTransitions] = useState([false, false, false, false])

  useEffect(() => {
    transitions.forEach((_, i) => {
      setTimeout(() => {
        setTransitions(prevState => ({
          ...prevState,
          [i]: true
        }))
      }, i*300);
    })
  }, [])

  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid item direction="column" xs="7">

          <Typography variant="h1" style={{ 'color': grey[900], textAlign: 'left' }}> Welcome to the future of <br />Energy Management</Typography>

          <Grid item xs="7">

            <br /><br /><br /><br />
            <Slide direction="left" in={transitions[0]} mountOnEnter unmountOnExit>
              <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 1. <span style={{ 'color': deepOrange[500] }}>Design</span> your system </Typography>
            </Slide>
            <br />
            <Slide direction="left" in={transitions[1]} mountOnEnter unmountOnExit>
              <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 2. <span style={{ 'color': green[500] }}>Simulate</span> your system </Typography>
            </Slide>
            <br />
            <Slide direction="left" in={transitions[2]} mountOnEnter unmountOnExit>
              <Typography variant="h2" style={{ 'color': grey[900], textAlign: 'left' }}> 3. <span style={{ 'color': blue[500] }}>See</span> the EMS in action </Typography>
            </Slide>

            <br /><br />
            <Grid xs="5">
              <Slide direction="left" in={transitions[3]} mountOnEnter unmountOnExit>
                {props.startButton()}
              </Slide>   
            </Grid>
          </Grid>
        </Grid>

        <Fade in={true} timeout={1500}>
          <Grid item xs="5">
            <img src={Murb} style={{ width: "40vw" }} alt="Buildings" />
            <img src={Ev} style={{ width: "40vw" }} alt="Electric Vehicle" />
          </Grid>
        </Fade>
      </Grid>
    </React.Fragment>
  )
}