import { Drawer, List, ListItem, ListItemIcon, ListItemText, Link } from '@material-ui/core';
import { BatteryChargingFull, Business, EvStation, Inbox, Info } from '@material-ui/icons';

export default () => (
  <Drawer width={2} variant="permanent">
    <br/><br/><br/>
    <List>
      <ListItem button>
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
      <ListItem button>
        <ListItemIcon>
          <Info/>
        </ListItemIcon>
        <ListItemText primary="About"/>
      </ListItem>
    </List>
  </Drawer>
)