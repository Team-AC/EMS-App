
import { Grid, Slide } from '@material-ui/core';
import { set } from 'date-fns';
import React, { useState } from 'react';
import EvSimulationCard from './EvSimulationCard';
import MurbSimulationCard from './MurbSimulationCard';

export default function Simulation() {
  const [murbCardTransition, setMurbCardTransition] = useState(false)
  const [evCardTransition, setEvCardTransition] = useState(false)

  setTimeout(() => setMurbCardTransition(true), 250)
  setTimeout(() => setEvCardTransition(true), 500)

  return (
    <Grid container spacing={2}>

      <Slide direction="left" in={murbCardTransition} mountOnEnter unmountOnExit>
        <Grid item xs={4}>
          <MurbSimulationCard/>
        </Grid>
      </Slide>

      <Slide direction="left" in={evCardTransition} mountOnEnter unmountOnExit>
        <Grid item xs={4}>
          <EvSimulationCard/>
        </Grid>
      </Slide>

    </Grid>
  )
}