import axios from 'axios';
import { makeStyles, useTheme} from '@material-ui/core/styles'
import {Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, Typography} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { blue, green } from '@material-ui/core/colors';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 150,
    marginTop: -12,
    marginLeft: 10
  },
}));

export default function Simulation() {
  const classes = useStyles();

  const [dataInterval, setDataInterval] = useState('');
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [generateDisabled, setGenerateDisabled] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [checkGeneratingInterval, setCheckGeneratingInterval] = useState(0);
  const [count, setCount] = useState(0);
  const [realTimeStatus, setRealTimeStatus] = useState(false);
  const [generateConfig, setGenerateConfig] = useState({});

  useEffect(() => {
    checkCount();
    checkStatus();
  }, [dataInterval]);

  useEffect(() => {
    checkStatus();
    if (count/generateConfig[dataInterval] >= 1) setGenerating(false);
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
    });
  }

  const generateMurbPower = () => {
    setGenerateDisabled(true);
    axios.post(`/api/murb/generate/${dataInterval}`)
    .then((res) => {
      setGenerating(true);
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
      checkStatus();
      // Implement snackbar
    })
    .catch((err) => {
      // Implement snackbar
    })
  }

  const handleIntervalChange = (event) => {
    setDataInterval(event.target.value);
    if (count === 0) {
      setGenerateDisabled(false);
    }
  };

  const RealTimeStatusVisual = () => (
    <Typography style={{color: realTimeStatus ? green[500] : blue[500]}}>
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
      const progressValue = (count/generateConfig[dataInterval] >= 1) ? 1 : count/generateConfig[dataInterval];
      return (
      <React.Fragment>
        <Typography>Historic Data Generating Progress</Typography>
        <LinearProgressWithLabel value={progressValue * 100} />
        <br/>
      </React.Fragment>
      )
    } else return null;
  }

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

            <HistoricStatusVisual/>

            <div style={{display:"flex"}}>
              <Typography style={{ textAlign: "left"}}  variant='body1'>
                Status of Realtime Generation: &nbsp;
              </Typography>
              <RealTimeStatusVisual/>
            </div>
            

            <Typography style={{ textAlign: "left"}} variant='body1'>
              Data-points Currently Generated: <b>{count}</b>
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
                    value={dataInterval}
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