import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { amber, blue, blueGrey, brown, cyan, deepOrange, grey, lightBlue, lightGreen, orange, red, teal, yellow } from '@material-ui/core/colors';
import { AttachMoney, BarChart, BatteryChargingFull, Business, EvStation, Inbox, Info, TouchAppOutlined } from '@material-ui/icons';
import { Link } from "react-router-dom";


export default (props) => {

  const drawerWidth = props.drawerWidth; // Defined in App.js to shift all content leftwards based on width

  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      background: lightBlue[50],
    },
    appBarSpacer: theme.mixins.toolbar,

  }));

  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="permanent"
      PaperProps={{ elevation: 5 }}
    >
      <div className={classes.appBarSpacer} />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText>
            <b>Energy Data for Building</b>
          </ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <EvStation />
          </ListItemIcon>
          <ListItemText primary="Energy Data for EV" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BatteryChargingFull />
          </ListItemIcon>
          <ListItemText primary="Energy Data for BESS" />
        </ListItem>
        <ListItem button component={Link} to="Financial">
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText primary="Financial" />
        </ListItem>
        <ListItem button component={Link} to="/Simulation">
          <ListItemIcon>
            <TouchAppOutlined />
          </ListItemIcon>
          <ListItemText primary="Simulation" />
        </ListItem>
        <ListItem button component={Link} to="/About">
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </Drawer>
  )
}