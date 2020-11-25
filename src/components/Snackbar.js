import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default () => {
  const [open, setOpen] = React.useState(false)

  const handClick = () => {
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar open={open} autohideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            Error 404! your brain is not found
          </Alert>
      </Snackbar>
    </div>
  )
}