import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { blue, green } from '@material-ui/core/colors';
import React from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../redux/actions';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 150,
    marginTop: -12,
    marginLeft: 10
  },
}));

export default function Simulation() {
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
  const [powerParams, setpowerParams] = useState({
    minPower: 1,
    maxPower: 300,
    avgPower: 150,
  })
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
    setpowerParams(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(powerParams);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
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

                <Button 
                  style={{ marginLeft: "20px" }}
                  variant="contained"
                  color="secondary"
                  // disabled={generateDisabled}
                  onClick={handleOpenParams}
                >
                  Set Parameters
                </Button>

                <Dialog open={changeParamsOpen} onClose={handleCloseParams} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Change power parameters</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Set the parameters to be used.
                    </DialogContentText>
                    <TextField
                      label="Min Power (kW)"
                      name="minPower"
                      onChange={handleParams}
                      fullWidth
                    />
                    <TextField
                      label="Max Power (kW)"
                      name="maxPower"
                      onChange={handleParams}
                      fullWidth
                    />
                    <TextField
                      label="Average Power (kW)"
                      name="avgPower"
                      onChange={handleParams}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseParams} color="primary">
                      Submit parameters
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
              
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={generateDisabled}
                  onClick={generateMurbPower}
                >
                  Generate
                </Button>
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
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}