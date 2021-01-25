import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { AttachMoney, BarChart, BatteryChargingFull, Business, EvStation, ExpandLess, ExpandMore, Inbox, Info, TouchAppOutlined } from '@material-ui/icons';
import { Link } from "react-router-dom";
import React from 'react';
import { useState } from 'react';

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
  const [open, setOpen] = useState();

  const handleOpen = () => {
    setOpen(!open);
  }
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
        <ListItem button onClick={handleOpen}>
          <ListItemText primary="Energy Management System" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Energy Data for Building" />
          </ListItem>
          <ListItem button component={Link} to="Charger">
            <ListItemIcon>
              <EvStation />
            </ListItemIcon>
            <ListItemText primary="Energy Data for EV Chargers" />
          </ListItem>
          <ListItem button >
            <ListItemIcon>
              <BatteryChargingFull />
            </ListItemIcon>
            <ListItemText primary="Energy Data for BESS" />
          </ListItem>
          <ListItem button component={Link} to="Financial">
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItem>
          
        </Collapse>
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