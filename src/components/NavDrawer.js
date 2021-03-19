import { Collapse, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { AttachMoney, BarChart, BatteryChargingFull, Business, EvStation, ExpandLess, ExpandMore, House, Inbox, Info, InsertChartOutlined, TouchAppOutlined } from '@material-ui/icons';
import { Link } from "react-router-dom";
import React from 'react';
import { useState } from 'react';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import BuildIcon from '@material-ui/icons/Build';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { useSelector } from 'react-redux';

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
  const drawerOpen = useSelector(store => store.drawer);
  const [openEms, setOpenEms] = useState(false);
  const [openDesign, setOpenDesign] = useState(false);
  const [openSimulation, setOpenSimulation] = useState(false);

  const handleOpen = (open, setOpen) => {
    setOpen(!open);
  }

  return (
    <Drawer open={drawerOpen}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="persistent"
      PaperProps={{ elevation: 5 }}
    >
      <div className={classes.appBarSpacer} />
      <List >
        <ListItem button component={Link} to="/Instructions">
          <ListItemIcon>
            <ChromeReaderModeIcon />
          </ListItemIcon>
          <ListItemText primary="Instructions" />
        </ListItem>
        
        <Divider />

        <ListItem button onClick={() => handleOpen(openDesign, setOpenDesign)}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Design" />
          {openDesign ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openDesign} timeout="auto" unmountOnExit>
          <ListItem button component={Link} to="Financial">
            <ListItemIcon>
              <LocalAtmIcon />
            </ListItemIcon>
            <ListItemText primary="Financial" />
          </ListItem>
        </Collapse>

        <Divider />

        <ListItem button component={Link} to="/Simulation">
          <ListItemIcon>
            <TouchAppOutlined />
          </ListItemIcon>
          <ListItemText primary="Simulation" />
        </ListItem>

        <Divider />

        <ListItem button onClick={() => handleOpen(openEms, setOpenEms)}>
          <ListItemIcon>
            <InsertChartIcon />
          </ListItemIcon>
          <ListItemText primary="Energy Management System" />
          {openEms ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openEms} timeout="auto" unmountOnExit>
          <ListItem button component={Link} to="MurbEnergy">
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
          <ListItem button component={Link} to="Bess">
            <ListItemIcon>
              <BatteryChargingFull />
            </ListItemIcon>
            <ListItemText primary="Energy Data for BESS" />
          </ListItem>
          <ListItem button component={Link} to="Billing">
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItem>
        </Collapse>

        <Divider />

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