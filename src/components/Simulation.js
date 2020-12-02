import axios from 'axios';
import { makeStyles, useTheme} from '@material-ui/core/styles'
import {Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from '@material-ui/core';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 150,
    marginTop: -12,
    marginLeft: 10
  },
}));

export default () => {
  const classes = useStyles();

  const [interval, setInterval] = useState('');
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [generateDisabled, setGenerateDisabled] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    checkCount();
  }, [interval]);

  const checkCount = () => {
    axios.get('/api/murb/count')
    .then((res) => {
      setCount(res.data.count);
      
      // Cannot generate when something in database, able to delete
      if (res.data.count !== 0) {
        setDeleteDisabled(false);
        setGenerateDisabled(true);
      
      // Cannot delete when nothing in database, able to generate (assuming interval selected)
      } else {
        setDeleteDisabled(true);
        if (interval) setGenerateDisabled(false);
      }
    })
    .catch((err) => {
      // Implement snackbar
    });
  }

  const generateMurbPower = () => {
    axios.post(`/api/murb/generate/${interval}`)
    .then((res) => {
      // Implement snackbar
    })
    .catch((err) => {
      // Implement snackbar
    })
  }

  const deleteMurbPower = () => {
    axios.delete(`/api/murb/`)
    .then((res) => {
      checkCount();
      // Implement snackbar
    })
    .catch((err) => {
      // Implement snackbar
    })
  }

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
    if (count === 0) {
      setGenerateDisabled(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card>
          <CardContent>

            <Typography variant="h5">
              MURB Simulation
            </Typography>

            <Divider/>
            <br/>

            <Typography style={{ textAlign: "left"}} variant='body1'>
              Status of Realtime Generation: TODO
            </Typography>

            <Typography style={{ textAlign: "left"}} variant='body1'>
              Amount of data-points in database: {count}
            </Typography>

          </CardContent>
          <CardActions>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Button 
                variant="contained" 
                color="primary"
                disabled={generateDisabled}
                onClick={generateMurbPower}
                >
                  Generate
                </Button>

                <FormControl className={classes.formControl}>
                  <InputLabel>Choose Interval</InputLabel>
                  <Select
                    value={interval}
                    onChange={handleIntervalChange}
                  >
                    <MenuItem value={'pastDay'}>Past Day</MenuItem>
                    <MenuItem value={'pastWeek'}>Past Week</MenuItem>
                    <MenuItem value={'pastMonth'}>Past Month</MenuItem>
                    <MenuItem value={'pastYear'}>Past Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <Button 
                  variant="contained"
                  color="secondary"
                  disabled={deleteDisabled}
                  onClick={deleteMurbPower}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}