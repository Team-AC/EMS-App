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

  const [evParams, setEvParams] = useState({
    numOfEvLevel2: 3,
    numOfEvLevel3: 3,
    evLevel2ChargeRate: 10,
    evLevel3ChargeRate: 100,
    percentageOfEv: 0.01,
    evBatteryAverage: 100,
    carFlow: 'high'
  })

  const [bessParams, setBessParams] = useState({
    batteryCapacity: 500,
    batteryPower: 100
  });

  const [evPredictionMode, setEvPredictionMode] = useState('Balanced')

  const [evPredictParams, setEvPredictParams] = useState({
    WeightPastMonth: 0.4,
    WeightPastYear: 0.3,
    WeightPastWeek: 0.3
  })

  const [defaultEvParams] = useState(evParams)
  const [defaultBessParams] = useState(bessParams);

  const [changeParamsOpen, setParamsOpen] = useState(false);

  const handleOpenParams = () => {
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
    axios.post(`/api/ev/generate/${dataInterval}`, { evParameters: evParams, bessParameters: bessParams, evPredictParameters: evPredictParams })
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

  const handleEvParams = e => {
    const { name, value } = e.target;

    setEvParams(prevState => ({
      ...prevState,
      [name]: value
    }));

  }

  const handleBessParams = e => {
    const { name, value } = e.target;

    setBessParams(prevState => ({
      ...prevState,
      [name]: value
    }));

  }

  const handleEvPredictsParams = e => {
    const formats = {
      "Conservative": "Conservative",
      "Balanced": "Balanced",
      "Aggressive": "Aggressive"
    }
    
    if (e.target.value === "Conservative") {
      setEvPredictionMode("Conservative")
      setEvPredictParams({
        WeightPastMonth: 0.2,
        WeightPastYear: 0.6,
        WeightPastWeek: 0.2
      })
    } else if (e.target.value === "Aggressive") {
      setEvPredictionMode("Aggressive")
      setEvPredictParams({
        WeightPastMonth: 0.2,
        WeightPastYear: 0.2,
        WeightPastWeek: 0.6
      })
    } else {
      setEvPredictionMode("Balanced")
      setEvPredictParams({
        WeightPastMonth: 0.4,
        WeightPastYear: 0.3,
        WeightPastWeek: 0.3
      })
    }
  }
  const resetParams = () => {
    setEvParams(defaultEvParams);
    setBessParams(defaultBessParams);
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

            <Dialog
              maxWidth={'md'}
              open={changeParamsOpen}
              onClose={handleCloseParams}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Simulate the EV Chargers and Their Car Flow</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Set the parameters to be used for the simulation.
                </DialogContentText>
                <Grid container spacing={3}>

                  <Grid item xs={4}>
                    <Card>
                      <Typography> EV Parameters </Typography>
                      <TextField
                        label="Number of Level 2 Chargers"
                        name="numOfEvLevel2"
                        value={evParams.numOfEvLevel2}
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                      <TextField
                        label="Number of Level 3 Chargers"
                        name="numOfEvLevel3"
                        value={evParams.numOfEvLevel3}
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                      <TextField
                        label="Charge Rate of Level 2 Chargers (kW)"
                        value={evParams.evLevel2ChargeRate}
                        name="evLevel2ChargeRate"
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                      <TextField
                        label="Charge Rate of Level 3 Chargers (kW)"
                        value={evParams.evLevel3ChargeRate}
                        name="evLevel3ChargeRate"
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                      <TextField
                        label="Percentage of Vehicles that are EVs (in local area)"
                        value={evParams.percentageOfEv}
                        name="percentageOfEv"
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                      <TextField
                        label="Average size of EV Battery"
                        value={evParams.evBatteryAverage}
                        name="evBatteryAverage"
                        onChange={handleEvParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                    </Card>
                    <FormControl fullWidth>
                      <InputLabel>Car Flow (in local area)</InputLabel>
                      <Select
                        value={evParams.carFlow}
                        name="carFlow"
                        onChange={handleEvParams}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography> BESS Parameters </Typography>
                    <Card>
                      <TextField
                        label="Battery size for BESS (kWh)"
                        value={bessParams.batteryCapacity}
                        name="batteryCapacity"
                        onChange={handleBessParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      /><TextField
                        label="Power for BESS (kW)"
                        value={bessParams.batteryPower}
                        name="batteryPower"
                        onChange={handleBessParams}
                        style={{ marginBottom: '30px' }}
                        fullWidth
                      />
                    </Card>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography> EV Prediction Mode </Typography>
                    <Card>
                      <FormControl fullWidth>
                        <InputLabel>EV Prediction Mode</InputLabel>
                        <Select
                          value={evPredictionMode}
                          name="EV Prediction Mode"
                          onChange={handleEvPredictsParams}
                        >
                          <MenuItem value="Conservative">Conservative</MenuItem>
                          <MenuItem value="Balanced">Balanced</MenuItem>
                          <MenuItem value="Aggressive">Aggressive</MenuItem>
                        </Select>
                      </FormControl>
                    </Card>

                  </Grid>
                </Grid>

              </DialogContent>
              <DialogActions>
                <Button onClick={resetParams} color="secondary">
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