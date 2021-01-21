
import { Grid, Slide } from '@material-ui/core';
import { set } from 'date-fns';
import React, { useState } from 'react';
import MurbSimulationCard from './MurbSimulationCard';

export default function Simulation() {
  const [murbCardTransition, setMurbCardTransition] = useState(false)

  setTimeout(() => setMurbCardTransition(true), 250)

  return (
    <Grid container spacing={2}>

      <Slide direction="left" in={murbCardTransition} mountOnEnter unmountOnExit>
        <Grid item xs={4}>
          <MurbSimulationCard/>
        </Grid>
      </Slide>

    </Grid>
  )
}