import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import axios from 'axios';

export default class graph extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        graphArray: [{
          id: 'murb-power',
          data: []
        }]
      }
    }

    componentDidMount() {
      axios.get('http://localhost:3000/api/murb')
      .then((res) => {
        this.setState((state, props) => {
          res.data.forEach((el, index)  => {
            state.graphArray[0].data[index] = {
              x: el.TimeStamp,
              y: el.Power
            };
          });
          
        });
      });
    }

    render() {
      return (
        <div style={{height: "50vh", width: "90vw"}}>
          <div style={{"margin-top": "70px"}}>Power Consumed by a MURB</div>
          <ResponsiveLine
            data={this.state.graphArray}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: '0', max: '75', stacked: true, reverse: false }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time (HH:MM)',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Power (kW)',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{"scheme":"category10"}}
            enableArea={true}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        </div>
      )
    }
}