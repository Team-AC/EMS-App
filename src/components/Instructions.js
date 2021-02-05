import React from 'react';
import { Typography } from '@material-ui/core';

export default () => {
  return (
    <React.Fragment>
      <Typography>
        How to use our App!<br />
        Click the dropdown Menu in the top-left corner to navigate through the page.<br />
        Start by going into the Simulation page, click on the delete button if it is highlighted, otherwise click on the generate button in the MURB/EV section and input some parameters.
        (Optional)Once the simulation is complete you can go into the MURB/EV page and click on one of the data intervals to see the generated data in graphs.
        You can go into the Calculator section to see projected costs of the MURB and EVs in the future.
      </Typography>
    </React.Fragment>
  )
}