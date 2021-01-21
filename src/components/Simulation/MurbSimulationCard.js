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

export default function MurbSimulationCard() {
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
  const [powerParams, setPowerParams] = useState({
    avgPower: 127.59,
    avgPowerSummer: 139.59,
    avgPowerFall: 142.24,
    avgPowerWinter: 128.36,
    avgPowerSpring: 100.60,
  })
  const [defaultPowerParams] = useState(powerParams)
  const [changeParamsOpen, setParamsOpen] = useState(false);
  const [showSeasonalParams, setShowSeasonalParams] = useState(false);

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
    axios.get('/api/murb/status')
      .then((res) => {
        setRealTimeStatus(res.data.real_time_data_status);
        setGenerateConfig(res.data.data_generate_config);
      })
      .catch((err) => {
        // Implement snackbar
        dispatch(enqueueSnackbar({
          message: 'Not generating',
          options: {
            variant: 'error',
          },
        }))
      });
  }

  const generateMurbPower = () => {
    setGenerateDisabled(true);
    setParamsOpen(false);
    axios.post(`/api/murb/generate/${dataInterval}`, null, {
      params: powerParams,
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

  // const generateEVChargers = () => {
  //   axios.post(`/api/ev/generate/${dataInterval}`
  //   ).then(
  //     //set generating to true
  //     //show a success snackbar
  //   )
  //   //.catch(err)
  //   //show an error snackbar
  // }

  const deleteMurbPower = () => {
    axios.delete(`/api/murb/`)
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

  const RealTimeStatusVisual = () => (
    <Typography style={{ color: realTimeStatus ? green[500] : blue[500] }}>
      <b>{realTimeStatus ? 'Simulation Running' : "Not Running"}</b>
    </Typography>
  )

  const LinearProgressWithLabel = (props) => (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );

  const HistoricStatusVisual = () => {
    if (generating && count > 0) {
      const progressValue = (count / generateConfig[dataInterval] >= 1) ? 1 : count / generateConfig[dataInterval];
      return (
        <React.Fragment>
          <Typography>Historic Data Generating Progress</Typography>
          <LinearProgressWithLabel value={progressValue * 100} />
          <br />
        </React.Fragment>
      )
    } else return null;
  }

  const handleParams = e => {
    const { name, value } = e.target;

    // Scale seasonal params if not showing
    if ((name == 'avgPower') && !showSeasonalParams && value) {
      const scaleFactor = isFinite(value/defaultPowerParams.avgPower) ? value/defaultPowerParams.avgPower : 1;
      setPowerParams({
        avgPower: value,
        avgPowerWinter: defaultPowerParams.avgPowerWinter*scaleFactor,
        avgPowerSpring: defaultPowerParams.avgPowerSpring*scaleFactor,
        avgPowerSummer: defaultPowerParams.avgPowerSummer*scaleFactor,
        avgPowerFall: defaultPowerParams.avgPowerFall*scaleFactor,
      });
    }

    else  {
      setPowerParams(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

  }

  const OptionalSeasonalParams = (props) => {
    if (props.show) return (
      <React.Fragment>
        <TextField
          label="Average Power Summer (kW)"
          name="avgPowerSummer"
          value={powerParams.avgPowerSummer}
          onChange={handleParams}
          fullWidth
        />
        <TextField
          label="Average Power Fall (kW)"
          name="avgPowerFall"
          value={powerParams.avgPowerFall}
          onChange={handleParams}
          fullWidth
        />
        <TextField
          label="Average Power Winter (kW)"
          name="avgPowerWinter"
          value={powerParams.avgPowerWinter}
          onChange={handleParams}
          fullWidth
        />
        <TextField
          label="Average Power Spring (kW)"
          name="avgPowerSpring"
          value={powerParams.avgPowerSpring}
          onChange={handleParams}
          fullWidth
        />
      </React.Fragment>
    ) 
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          MURB Simulation
        </Typography>

        <Divider />
        <br />

        <HistoricStatusVisual />

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
              <DialogTitle id="form-dialog-title">Simulate a MURB's Load Profile</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Set the parameters to be used for the simulation.
                </DialogContentText>
                <TextField
                  label="Average Power For the MURB (kW)"
                  name="avgPower"
                  value={powerParams.avgPower}
                  onChange={handleParams}
                  fullWidth
                />

              <FormControlLabel
                control={
                  <Switch
                    checked={showSeasonalParams}
                    onChange={() => setShowSeasonalParams(!showSeasonalParams)}
                  />
                }
                label="Manually Adjust Seasonal Parameters (Defaults are for Toronto)"
              />

              {OptionalSeasonalParams({show: showSeasonalParams})}
                
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPowerParams(defaultPowerParams)} color="secondary">
                  Reset Parameters
                </Button>
                <Button onClick={generateMurbPower} color="primary">
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
              onClick={deleteMurbPower}
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