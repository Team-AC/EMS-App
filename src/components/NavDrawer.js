import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { BatteryChargingFull, Business, EvStation, Inbox, Info, TouchAppOutlined } from '@material-ui/icons';
import {Link} from "react-router-dom";


export default () => (
  <Drawer width={2} variant="permanent">
    <br/><br/><br/>
    <List>
      <ListItem button component = {Link} to ="/">
        <ListItemIcon>
          <Business/>
        </ListItemIcon>
        <ListItemText primary="Energy Data for Building"/>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <EvStation/>
        </ListItemIcon>
        <ListItemText primary="Energy Data for EV"/>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BatteryChargingFull/>
        </ListItemIcon>
        <ListItemText primary="Energy Data for BESS"/>
      </ListItem>
      <ListItem button component={Link} to="/Simulation">
        <ListItemIcon>
          <TouchAppOutlined/>
        </ListItemIcon>
        <ListItemText primary ="Simulation"/>
      </ListItem>
      <ListItem button component ={Link} to="/About">
        <ListItemIcon>
          <Info/>
        </ListItemIcon>
        <ListItemText primary="About"/> 
      </ListItem>   
    </List>
  </Drawer>
)