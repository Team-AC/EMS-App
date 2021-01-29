import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import axios from 'axios';
import { Box, Typography } from '@material-ui/core';
import { cyan, blue, purple } from '@material-ui/core/colors';

const Graph = (props) => (
  <div style={{ height: "50vh" }}>
    <Typography variant="h5">
      Power Consumed by your MURB
    </Typography>

    <ResponsiveLine
      data={[{
        id: 'murb-power',
        data: props.data,
      }]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 0, max: 'auto', reverse: false }}
      yFormat=" >-.2f"
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 15,
        tickValues: props.tickValues,
        legend: 'Time',
        legendOffset: 42,
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
      colors={[cyan[900]]}
      curve={"natural"}
      enableArea={true}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableSlices={'x'}

      sliceTooltip={({ slice }) => {
        return (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              textAlign: "left"
            }}
          >
            <Typography style={{color: purple[300]}}>
                <b>Time:</b> {slice.points[0].data.xFormatted}
            </Typography>
            <Typography style={{color: blue[500]}}>
                <b>Power:</b> {slice.points[0].data.yFormatted}
            </Typography>
          </div>
        )
      }}
    />
  </div>
)

export default Graph;