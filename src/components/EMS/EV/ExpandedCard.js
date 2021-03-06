import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';
import EVGraph from './EVGraph';
import ChargeBar from './ChargeBar';
import CostBar from './CostBar';
import VehicleBar from './VehicleBar';
export default class ExpandedCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openInner: false,
      openOuter: false,
    };
    this.handleOuterOpen = this.handleOuterOpen.bind(this);
  }

  // first dialog shown, reached from the cards
  handleOuterOpen = () => {
    this.setState({ openOuter: !this.state.openOuter })
  };
  // inner dialog only openable from the first dialog
  handleInnerOpen = () => {
    this.setState({ openInner: !this.state.openInner})
  }
  render() {
    return (
      <Card>
        <CardHeader
          style={{backgroundColor: this.props.headerColor}}
          avatar={this.props.media}
          title="EV Charger"
          subheader={'Level ' + this.props.subheader}
        />
        <CardContent style={{textAlign:'left'}}>
          <Typography style={{whiteSpace: 'pre-line'}}>{this.props.evInfo}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            onClick={this.handleOuterOpen}
            aria-expanded={this.state.openOuter}
            aria-label="show-more"
            variant="contained"
            color="primary"
          >
            Show graph details
          </Button>
          <Dialog 
            fullWidth={true} 
            maxWidth={'lg'}
            open={this.state.openOuter} 
            onClose={this.handleOuterOpen}
            scroll={'body'}
          >
            <DialogContent style={{overflow:"hidden"}}>
              <EVGraph
                data={this.props.powerData}
                tickValues={this.props.tickValues}
              />
              <ChargeBar
                data={this.props.chargeData}
                tickValues={this.props.tickValues}
              />
              <CostBar
                data={this.props.costData}
                tickValues={this.props.tickValues}
              />
              <VehicleBar
                data={this.props.vehicleData}
                tickValues={this.props.tickValues}
              />
            </DialogContent>
          </Dialog>
        </CardActions>
      </Card>
    )
  }
}