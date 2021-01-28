import { Button, Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { amber, blue, deepOrange, green, grey, purple, red, yellow } from '@material-ui/core/colors';
import React from 'react';

export default function Home() {
  return (
    <React.Fragment>
      <Grid Container direction="row">
        <Grid item direction="column" xs="9">
          
          <Typography variant="h1" style={{'color': grey[900], textAlign: 'left'}}> Welcome to the future of <br/>Energy Management</Typography>

          <Grid xs="7">
            <br/><br/><br/><br/>
            <Typography variant="h2" style={{'color': grey[900], textAlign: 'left'}}> 1. <span style={{'color': deepOrange[500]}}>Design</span> your system </Typography>
            <br/>
            <Typography variant="h2" style={{'color': grey[900], textAlign: 'left'}}> 2. <span style={{'color': green[500]}}>Simulate</span> your system </Typography>
            <br/>
            <Typography variant="h2" style={{'color': grey[900], textAlign: 'left'}}> 3. <span style={{'color': blue[500]}}>See</span> the EMS in action </Typography>

            <br/><br/>
            
          </Grid>

          <Grid xs="5">
            <Button variant="contained" style={{marginRight: ''}}>Get Started</Button>
          </Grid>
        </Grid>

        <Grid xs="3">

        </Grid>
      </Grid>


    </React.Fragment>
  )
}