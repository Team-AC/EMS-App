import axios from 'axios';
import React from 'react';
import { setDate } from 'date-fns';
import { useEffect, useState } from 'react';
import FinancialGraph from "./FinancialGraph";
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@material-ui/core';

export default function Financial() {
  const [financialParams, setFinancialParams] = useState({
    amountOfYears: 12,
    inflationRate: 0.02,
    arrivalFlowPercentageLevel2: 0.25,
    arrivalFlowPercentageLevel3: 0.75,
    energyCostNoSurge: 0.085,
    energyCostBeforeThreshold: 0.101,
    energyCostPastThreshold: 0.118,
    installationCostLvl2: 3000,
    installationCostLvl3: 21000,
  });

  const [presentParams, setPresentParams] = useState({
    kwCapRegularRate: 12000,
    averageChargePercentage: 0.4,
    averageBatterySize: 75,
    energyCost: 0.085,
    evArrivalsPerYear: 3000,
    networkCost: 200,
    maintenanceLevel2: 300,
    maintenanceLevel3: 1500
  });
  const [futureParams, setFutureParams] = useState({
    kwCapRegularRate: 15000,
    averageChargePercentage: 0.7,
    averageBatterySize: 150,
    energyCost: 1,
    evArrivalsPerYear: 5000,
    networkCost: 500,
    maintenanceLevel2: 600,
    maintenanceLevel3: 2000
  });
  const [defaultFinancialParams] = useState(financialParams);
  const [defaultPresentParams] = useState(presentParams);
  const [defaultFutureParams] = useState(futureParams);

  const [paramsDialogOpen, setParamsDialogOpen] = useState(false);

  const [data, setData] = useState([])

  const formatForGraph = (dataArray) => {
    const graphArray = [
      {
        id: "Maintenance and Capital Costs",
        data: []
      },
      {
        id: "Total Pricing without Surge",
        data: []
      },
      {
        id: "Total Pricing with Surge",
        data: []
      }
    ];

  
    for (const data of dataArray) {
      const {
        year,
        network_cost,
        lvl_2_installation_cost,
        lvl_3_installation_cost,
        lvl_2_maintenance_cost,
        lvl_3_maintenance_cost,
        lvl_2_no_surge_cost,
        lvl_3_no_surge_cost,
        lvl_2_before_surge,
        lvl_3_before_surge,
        lvl_2_surge,
        lvl_3_surge
      } = data;

      const maintenanceAndCapitalCost = network_cost + lvl_2_installation_cost + lvl_3_installation_cost + lvl_2_maintenance_cost + lvl_3_maintenance_cost;
      graphArray[0].data.push({ y: maintenanceAndCapitalCost, x: year});

      const totalCostWithoutSurge = maintenanceAndCapitalCost + lvl_2_no_surge_cost + lvl_3_no_surge_cost;
      graphArray[1].data.push({ y: totalCostWithoutSurge, x: year});

      const totalCostWithSurge = maintenanceAndCapitalCost + lvl_2_before_surge + lvl_3_before_surge + lvl_2_surge + lvl_3_surge;
      graphArray[2].data.push({ y: totalCostWithSurge, x: year});
    }

    return graphArray;
  }

  const handleFinancialParams = e => {
    const { name, value } = e.target;

    setFinancialParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handlePresentParams = e => {
    const { name, value } = e.target;

    setPresentParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleFutureParams = e => {
    const { name, value } = e.target;

    setFutureParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const sendRequest = () => {
    axios.post('/api/design/finance/', {
      ...financialParams,
      present: presentParams,
      future: futureParams
    })
      .then(res => setData(res.data))
  }

  const resetParams = () => {
    setFinancialParams(defaultFinancialParams)
    setPresentParams(defaultPresentParams)
    setFutureParams(defaultFutureParams)
  }

  const generateFinancialData = () => {
    sendRequest();
    setParamsDialogOpen(false);
  }

  const presentFields = () => {
    return (
      <Card>
        <Typography variant={'h6'}>
          Set present parameters to be used in the simulation.
          <br></br>
        </Typography>

        <TextField
          label="Power cap of the regular rate (kW)"
          value={presentParams.kwCapRegularRate}
          name="kwCapRegularRate"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Present Average Charge (%)"
          value={presentParams.averageChargePercentage}
          name="averageChargePercentage"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Present Average Battery Size (kWh)"
          value={presentParams.averageBatterySize}
          name="averageBatterySize"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Present Cost of Energy ($/kWh)"
          value={presentParams.energyCost}
          name="energyCost"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Present Number of EVs arriving annually"
          value={presentParams.evArrivalsPerYear}
          name="evArrivalsPerYear"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Present Network Cost ($)"
          value={presentParams.networkCost}
          name="networkCost"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
        <TextField
          label="Present Maintenance Cost for Lv2($)"
          value={presentParams.maintenanceLevel2}
          name="maintenanceLevel2"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
        <TextField
          label="Present Maintenance Cost for Lv3($)"
          value={presentParams.maintenanceLevel3}
          name="maintenanceLevel3"
          onChange={handlePresentParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
      </Card>
    )
  };

  const futureFields = () => {
    return (
      <Card>
        <Typography variant={'h6'}>
          Set future parameters to be used in the simulation.
          <br></br>
        </Typography>

        <TextField
          label="Power cap of the regular rate (kW)"
          value={futureParams.kwCapRegularRate}
          name="kwCapRegularRate"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Future Average Charge (%)"
          value={futureParams.averageChargePercentage}
          name="averageChargePercentage"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Future Average Battery Size (kWh)"
          value={futureParams.averageBatterySize}
          name="averageBatterySize"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Future Cost of Energy ($/kWh)"
          value={futureParams.energyCost}
          name="energyCost"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Future Number of EVs arriving annually"
          value={futureParams.evArrivalsPerYear}
          name="evArrivalsPerYear"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />

        <TextField
          label="Future Network Cost ($)"
          value={futureParams.networkCost}
          name="networkCost"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
        <TextField
          label="Future Maintenance Cost for Lv2($)"
          value={futureParams.maintenanceLevel2}
          name="maintenanceLevel2"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
        <TextField
          label="Future Maintenance Cost for Lv3($)"
          value={futureParams.maintenanceLevel3}
          name="maintenanceLevel3"
          onChange={handleFutureParams}
          style={{ marginBottom: '30px' }}
          fullWidth
        />
      </Card>
    )
  }
  return (
    <Grid Container spacing={2}>
      <Dialog
        maxWidth={'lg'}
        open={paramsDialogOpen}
        onClose={() => setParamsDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Simulate the EV Chargers and Their Car Flow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set the parameters to be used for the simulation.
          </DialogContentText>

          <TextField
            label="How many years do you want to generate the data for?"
            value={financialParams.amountOfYears}
            name="amountOfYears"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />

          <TextField
            label="What is the estimated inflation rate?"
            value={financialParams.inflationRate}
            name="inflationRate"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />

          <TextField
            label="How many EVs will use Level 2 Chargers?"
            value={financialParams.arrivalFlowPercentageLevel2}
            name="arrivalFlowPercentageLevel2"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          <TextField
            label="How much does the non-surge energy cost?"
            value={financialParams.energyCostNoSurge}
            name="energyCostNoSurge"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          <TextField
            label="How much does the energy cost before the threshold"
            value={financialParams.energyCostBeforeThreshold}
            name="energyCostBeforeThreshold"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          <TextField
            label="How much does the energy cost past the threshold"
            value={financialParams.energyCostPastThreshold}
            name="energyCostPastThreshold"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          <TextField
            label="How much does it cost to install level 2 chargers"
            value={financialParams.installationCostLvl2}
            name="installationCostLvl2"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          <TextField
            label="How much does it cost to install level 3 chargers"
            value={financialParams.installationCostLvl3}
            name="installationCostLvl3"
            onChange={handleFinancialParams}
            style={{ marginBottom: '30px' }}
            fullWidth
          />
          

          <Grid container spacing={3}>
            <Grid item xs={6}>
              {presentFields()}
            </Grid>
            <Grid item xs={6}>
              {futureFields()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetParams} color="secondary">
            Reset Parameters
          </Button>
          <Button onClick={generateFinancialData} color="primary">
            Start Generation
          </Button>
        </DialogActions>
      </Dialog>

      <FinancialGraph data={formatForGraph(data)} />
      <Button color="primary" style={{ marginTop: 30 }} onClick={() => setParamsDialogOpen(true)} variant="contained">
        Generate
      </Button>
    </Grid>
  );
}
