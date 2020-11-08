import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import axios from 'axios';

const Graph = (props) => (
  <div style={{height: "50vh", width: "90vw"}}>
    <div style={{"marginTop": "70px"}}>Power Consumed by a MURB</div>
    <ResponsiveLine
      data={[{
        id: 'murb-power',
        data: props.data
      }]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: '0', max: '75', reverse: false }}
      yFormat=" >-.2f"
      axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 15,
          tickValues: props.tickValues,
          legend: 'Time (HH:MM)',
          legendOffset: 36,
          legendPosition: 'middle',
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          legend: 'Power (kW)',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
      colors={{"scheme":"category10"}}
      curve={"natural"}
      enableArea={true}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableSlices={'x'}
    />
  </div>
)

export default Graph;