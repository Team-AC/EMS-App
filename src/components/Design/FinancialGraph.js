import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import { Typography } from '@material-ui/core';
import { cyan, blue, purple, red, green, lightGreen } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

const FinancialGraph = (props) => {
  if (props.data[0].data.length > 0) {
    return (
      <div style={{ height: "50vh" }}>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Financial Projections
        </Typography>

        <ResponsiveLine
          data={props.data}
          margin={{ top: 50, right: 100, bottom: 100, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', reverse: false }}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 15,
            tickValues: props.tickValues,
            legend: 'Year',
            legendOffset: 42,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            legend: 'Cost ($)',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={[cyan[900], red[500], lightGreen[500]]}
          curve={"natural"}
          enableArea={true}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableSlices={'x'}
          legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 100,
                itemHeight: 30,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
          ]}
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

                <Typography style={{ color: green[500] }}>
                  <b>Total Cost with Surge Pricing:</b> ${slice.points[0].data.yFormatted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Typography>

                <Typography style={{ color: red[500] }}>
                  <b>Total Cost without Surge Pricing:</b> ${slice.points[1].data.yFormatted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Typography>

                <Typography style={{ color: blue[500] }}>
                  <b>Maintenance and Capital Cost:</b> ${slice.points[2].data.yFormatted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Typography>
              </div>
            )
          }}
        />
      </div>
    )
  } else {
    return (<Alert severity="error"> Cannot show Financial graph (please generate data if you haven't done so) </Alert>);
  }
}
export default FinancialGraph;