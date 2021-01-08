import React from 'react';
import { Button } from '@material-ui/core'
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../redux/actions';

export default () => {
  const dispatch = useDispatch();
  return (
    <div style={{ marginTop: "70px" }}>
      <h2>About Us</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          dispatch(enqueueSnackbar({
            message: 'test',
            options: {
              variant: 'success',
            },
          }))
        }
      >
        Test
      </Button>
    </div>
  )
}

