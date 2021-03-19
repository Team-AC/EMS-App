import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { Alert } from '@material-ui/lab'
import { Typography } from '@material-ui/core'

const BessPie = (props) => {
  if (props.length > 0) {
    return (
      <div style={{ height: "50vh" }}>
        <Typography variant="h5" style={{ textAlign: 'center', marginTop: 50 }}>
          Output of Bess
        </Typography>
        <ResponsivePie
          data={[{
            id: "bess",
            data: props.data,
          }]}
          margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
          width={600}
          height={600}
          legends={{
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          }}
        />
      </div>
    )
  } else {
    return <Alert severity="error"> Cannot show Battery pie graph </Alert>;
  }
}