import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@material-ui/core';

export default class ExpandedCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    };
    this.handleExpandChange = this.handleExpandChange.bind(this);
  }

  handleExpandChange = () => {
    this.setState({ expanded: !this.state.expanded })
  };

  render() {
    return (
      <Card>
        <CardHeader
          avatar= {this.props.media}
          title="EV Charger"
          subheader={'Level ' + this.props.subheader}
        />
        <CardContent style={{textAlign:'left'}}>
          <Typography style={{whiteSpace: 'pre-line'}}>{this.props.EvInfo}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            onClick={this.handleExpandChange}
            aria-expanded={this.state.expanded}
            aria-label="show-more"
            variant="contained"
            color="primary"
          >
            Show more details
          </Button>
        </CardActions>
      </Card>
    )
  }
}