import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import { Typography } from '@material-ui/core';
import { cyan, blue, purple } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

const EVGraph = (props) => {
  if (props.data.length > 0 || props.tickValues.length > 0) {
    return (
      <div style={{ height: "50vh" }}>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Power Consumed by this Charger
      </Typography>

        <ResponsiveLine
          data={[{
            id: 'ev-charger',
            data: props.data,
          }]}
          margin={{ top: 50, right: 100, bottom: 100, left: 50 }}
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
                <Typography style={{ color: purple[300] }}>
                  <b>Time:</b> {slice.points[0].data.xFormatted}
                </Typography>
                <Typography style={{ color: blue[500] }}>
                  <b>Power:</b> {slice.points[0].data.yFormatted}
                </Typography>
              </div>
            )
          }}
        />
      </div>
    )
  } else {
    return (<Alert severity="error"> Cannot show Power graph </Alert>);
  }
}
export default EVGraph;