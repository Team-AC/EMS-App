import axios from 'axios';
import React from 'react';
import { setDate } from 'date-fns';
import { useEffect, useState } from 'react';
import FinancialGraph from "./FinancialGraph";

export default function Financial() {

  const [financialParams, setFinancialParams] = useState({
    evSmallBatteryAverage: 50,
    evMediumBatteryAverage: 100,
    evLargeBatteryAverage: 150,
    evSmallBatteryProbability: 0.05,
    evMediumBatteryProbability: 0.75,
    evLargeBatteryProbability: 0.3,
    amountOfYears: 12,
    energyCost: 0.085,
    arrivalFlowPercentageLevel2: 0.25,
    arrivalFlowPercentageLevel3: 0.75,
    evGrowthPerYear: 0.01,
    evArrivalsPerYear: 3000,
    inflationRate: 0.02,
  })

  const [data, setData] = useState([])

  useEffect(() => {
    sendRequest();
  }, [])

  const formatForGraph = ((dataArray) => {
    console.log(dataArray)
    return dataArray.map((data) => ({y: data.lvl_2 + data.lvl_3, x: data.year}))
  })

  const sendRequest = () => {
    axios.post('/api/design/finance/', {}, {
      params: financialParams
    })
    .then(res => setData(res.data))
  }

  return (
    <FinancialGraph data={formatForGraph(data)}/>
  )
}