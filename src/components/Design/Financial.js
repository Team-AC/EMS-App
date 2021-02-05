import axios from 'axios';
import React from 'react';
import { setDate } from 'date-fns';
import { useEffect, useState } from 'react';
import FinancialGraph from "./FinancialGraph";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@material-ui/core';

export default function Financial() {

  const [financialParams, setFinancialParams] = useState({
    evSmallBatteryAverage: 50,
    evMediumBatteryAverage: 100,
    evLargeBatteryAverage: 150,
    evSmallBatteryProbability: 0.05,
    evMediumBatteryProbability: 0.75,
    evLargeBatteryProbability: 0.2,
    amountOfYears: 15,
    energyCost: 0.085,
    arrivalFlowPercentageLevel2: 0.25,
    arrivalFlowPercentageLevel3: 0.75,
    evGrowthPerYear: 0.01,
    evArrivalsPerYear: 3000,
    inflationRate: 0.02,
  });
  const [defaultParams] = useState(financialParams);
  const [paramsDialogOpen, setParamsDialogOpen] = useState(false);

  const [data, setData] = useState([])

  const formatForGraph = ((dataArray) => {
    return dataArray.map((data) => ({y: data.lvl_2 + data.lvl_3, x: data.year}))
  })

  const handleParams = e => {
    const { name, value } = e.target;

    setFinancialParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const sendRequest = () => {
    axios.post('/api/design/finance/', {}, {
      params: financialParams
    })
    .then(res => setData(res.data))
  }

  const generateFinancialData = () => {
    sendRequest();
    setParamsDialogOpen(false);
  }

  return (
    <Grid Container>
      <Dialog open={paramsDialogOpen} onClose={() => setParamsDialogOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Simulate the EV Chargers and Their Car Flow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the parameters to be used for the simulation.
          </DialogContentText>

          <TextField
            label="How many years do you want to generate the data for?"
            value={financialParams.amountOfYears}
            name="amountOfYears"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Cost of Energy ($/kWh)"
            value={financialParams.energyCost}
            name="energyCost"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Percentage of EV's using level 2 chargers"
            value={financialParams.arrivalFlowPercentageLevel2}
            name="arrivalFlowPercentageLevel2"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Percentage of EV's using level 3 chargers"
            value={financialParams.arrivalFlowPercentageLevel3}
            name="arrivalFlowPercentageLevel3"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Projected EV Growth Per Year"
            value={financialParams.evGrowthPerYear}
            name="evGrowthPerYear"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Projected EV arrivals (in current year)"
            value={financialParams.evArrivalsPerYear}
            name="evArrivalsPerYear"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Projected Yearly Inflation Rate"
            value={financialParams.inflationRate}
            name="inflationRate"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Percentage of EV's With a Small Battery Size"
            value={financialParams.evSmallBatteryProbability}
            name="evSmallBatteryProbability"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Percentage of EV's With a Medium Battery Size"
            value={financialParams.evMediumBatteryProbability}
            name="evMediumBatteryProbability"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label="Percentage of EV's With a Large Battery Size"
            value={financialParams.evLargeBatteryProbability}
            name="evLargeBatteryProbability"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label='Definition of an average "Small" Battery (kWh)'
            value={financialParams.evSmallBatteryAverage}
            name="evSmallBatteryAverage"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label='Definition of an average "Medium" Battery (kWh)'
            value={financialParams.evMediumBatteryAverage}
            name="evMediumBatteryAverage"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />

          <TextField
            label='Definition of an average "Large" Battery (kWh)'
            value={financialParams.evLargeBatteryAverage}
            name="evLargeBatteryAverage"
            onChange={handleParams}
            style={{marginBottom: '30px'}}
            fullWidth
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinancialParams(defaultParams)} color="secondary">
            Reset Parameters
          </Button>
          <Button onClick={generateFinancialData} color="primary">
            Start Generation
          </Button>
        </DialogActions>
      </Dialog>

      <FinancialGraph data={formatForGraph(data)}/>
      <Button color="primary" style={{marginTop: 30}} onClick={() => setParamsDialogOpen(true)} variant="contained">
        Generate
      </Button>
    </Grid>
  );
}
