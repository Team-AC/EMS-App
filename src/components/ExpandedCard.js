import React from 'react';
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
      <Card style={{width: '26vw'}}>
        <CardHeader
          title="EV Charger"
          subheader={this.props.subheader}
        />
        <CardContent style={{textAlign:'left'}}>
          <Typography>{this.props.avgpower}</Typography>
          <Typography>{this.props.numcars}</Typography>
          <Typography>{this.props.avgcarpower}</Typography>
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