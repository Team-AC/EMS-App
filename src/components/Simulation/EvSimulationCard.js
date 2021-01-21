import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, Switch, TextField, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { blue, green } from '@material-ui/core/colors';
import React from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 150,
    marginTop: -12,
    marginLeft: 10
  },
}));

export default function EvSimulationCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [dataInterval, setDataInterval] = useState('');
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [generateDisabled, setGenerateDisabled] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [checkGeneratingInterval, setCheckGeneratingInterval] = useState(0);
  const [count, setCount] = useState(0);
  const [realTimeStatus, setRealTimeStatus] = useState(false);
  const [generateConfig, setGenerateConfig] = useState({});
  const [params, setParams] = useState({
    numOfEvLevel2: 3,
    numOfEvLevel3: 3,
    evLevel2ChargeRate: 10,
    evLevel3ChargeRate: 100,
    percentageOfEv: 0.1,
    evSmallBatteryAverage: 50,
    evMediumBatteryAverage: 100,
    evLargeBatteryAverage: 150,
    evSmallBatteryProbability: 0.05,
    evMediumBatteryProbability: 0.75,
    evLargeBatteryProbability: 0.05,
    carFlow: 'medium'
  })
  const [defaultParams] = useState(params)
  const [changeParamsOpen, setParamsOpen] = useState(false);

  const handleOpenParams = () =>{
    setParamsOpen(true);
  }

  const handleCloseParams = () => {
    setParamsOpen(false);
  };

  useEffect(() => {
    checkCount();
    checkStatus();
  }, [dataInterval]);

  useEffect(() => {
    checkStatus();
    if (count / generateConfig[dataInterval] >= 1) setGenerating(false);
  }, [count]);

  useEffect(() => {
    if (generating) {
      setCheckGeneratingInterval(setInterval(() => {
        checkCount();
      }, 3000));
    } else {
      clearInterval(checkGeneratingInterval);
    }
  }, [generating]);

  const checkCount = () => {
    axios.get('/api/ev/count')
      .then((res) => {
        setCount(res.data.count);

        // Cannot generate when something in database, able to delete
        if (res.data.count !== 0) {
          setDeleteDisabled(false);
          setGenerateDisabled(true);

          // Cannot delete when nothing in database, able to generate (assuming interval selected)
        } else {
          setDeleteDisabled(true);
          if (dataInterval) setGenerateDisabled(false);
        }
      })
      .catch((err) => {
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Could not retrieve test data',
          options: {
            variant: 'error',
          },
        }))
      });
  }

  const checkStatus = () => {
    axios.get('/api/ev/status')
      .then((res) => {
        setRealTimeStatus(res.data.real_time_data_status);
      })
      .catch((err) => {
        setRealTimeStatus(false);
      });
  }

  const generateEvPower = () => {
    setGenerateDisabled(true);
    setParamsOpen(false);
    axios.post(`/api/ev/generate/${dataInterval}`, null, {
      params,
    })
      .then((res) => {
        setGenerating(true);
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Generating',
          options: {
            variant: 'success',
          },
        }))
      })
      .catch((err) => {
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Not generating',
          options: {
            variant: 'error',
          },
        }))
      })
  }

  const deleteEvPower = () => {
    axios.delete(`/api/ev/`)
      .then((res) => {
        checkCount();
        checkStatus();
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Data deleted',
          options: {
            variant: 'success',
          },
        }))
      })
      .catch((err) => {
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Could not delete data',
          options: {
            variant: 'error',
          },
        }))
      })
  }

  const handleIntervalChange = (event) => {
    setDataInterval(event.target.value);
    if (count === 0) {
      setGenerateDisabled(false);
    }
  };

  const handleParams = e => {
    const { name, value } = e.target;

    setParams(prevState => ({
      ...prevState,
      [name]: value
    }));

  }

  const RealTimeStatusVisual = () => (
    <Typography style={{ color: realTimeStatus ? green[500] : blue[500] }}>
      <b>{realTimeStatus ? 'Simulation Running' : "Not Running"}</b>
    </Typography>
  )

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          EV Simulation
        </Typography>

        <Divider />
        <br />

        <div style={{ display: "flex" }}>
          <Typography style={{ textAlign: "left" }} variant='body1'>
            Status of Realtime Generation: &nbsp;
          </Typography>
          <RealTimeStatusVisual />
        </div>


        <Typography style={{ textAlign: "left" }} variant='body1'>
          Data-points Currently Generated: <b>{count}</b>
        </Typography>

      </CardContent>
      <CardActions>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel>Choose Interval</InputLabel>
              <Select
                value={dataInterval}
                onChange={handleIntervalChange}
              >
                <MenuItem value={'pastDay'}>Past Day</MenuItem>
                <MenuItem value={'pastWeek'}>Past Week</MenuItem>
                <MenuItem value={'pastMonth'}>Past Month</MenuItem>
                <MenuItem value={'pastYear'}>Past Year</MenuItem>
              </Select>
            </FormControl>

            <Dialog open={changeParamsOpen} onClose={handleCloseParams} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Simulate the EV Chargers and Their Car Flow</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Set the parameters to be used for the simulation.
                </DialogContentText>

                <form>
                <TextField
                  label="Number of Level 2 Chargers"
                  value={params.numOfEvLevel2}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Number of Level 3 Chargers"
                  value={params.numOfEvLevel3}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evLevel2ChargeRate}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evLevel3ChargeRate}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.percentageOfEv}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evSmallBatteryAverage}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evMediumBatteryAverage}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evLargeBatteryAverage}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evSmallBatteryProbability}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evMediumBatteryProbability}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.evLargeBatteryProbability}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                <TextField
                  label="Charge Rate of Level 2 Chargers (kW)"
                  value={params.carFlow}
                  onChange={handleParams}
                  style={{marginBottom: '15px'}}
                  fullWidth
                />
                </form>
                
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setParams(defaultParams)} color="secondary">
                  Reset Parameters
                </Button>
                <Button onClick={generateEvPower} color="primary">
                  Start Generation
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          
          <Grid item>
            <Button style={{ marginLeft: "25px" }}
              variant="contained"
              color="secondary"
              disabled={deleteDisabled}
              onClick={deleteEvPower}
            >
              Delete
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={generateDisabled}
              onClick={handleOpenParams}
            >
              Generate
            </Button>
          </Grid>

        </Grid>
      </CardActions>
    </Card>
  )
}