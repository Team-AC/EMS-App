import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogContent, Typography } from '@material-ui/core';
import EVGraph from './EVGraph';

export default class ExpandedCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: !this.state.open })
  };

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
          <Typography style={{whiteSpace: 'pre-line'}}>{this.props.EvInfo}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            onClick={this.handleOpen}
            aria-expanded={this.state.open}
            aria-label="show-more"
            variant="contained"
            color="primary"
          >
            Show more details
          </Button>
          <Dialog 
            fullWidth={true} 
            maxWidth={'lg'}
            open={this.state.open} 
            onClose={this.handleOpen
            }>
            <DialogContent style={{overflow: "hidden"}}>
              <EVGraph
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                data={this.props.data}
                tickValues={this.props.tickValues}
              />
            </DialogContent>
          </Dialog>
        </CardActions>
      </Card>
    )
  }
}