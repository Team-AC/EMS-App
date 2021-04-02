import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { Alert } from '@material-ui/lab'
import { Typography } from '@material-ui/core'

const EvPie = (props) => {
  if (props.data.some(el => el.value > 0)) {
    return (
      <div style={{ height: "60vh" }}>
        <Typography variant="h5" style={{ textAlign: 'center', marginTop: 50 }}>
          Ev Charging
        </Typography>
        <ResponsivePie
          data={props.data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'accent' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[
            {
              anchor: 'bottom',
              direction: 'column',
              justify: false,
              translateX: -200,
              translateY: 0,
              itemsSpacing: 5,
              itemWidth: 200,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        />
      </div>
    )
  } else {
    return <Alert severity="error"> Cannot show Battery pie graph </Alert>;
  }
}

export default EvPie;