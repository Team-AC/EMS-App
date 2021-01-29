import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import { lightBlue } from "@material-ui/core/colors";
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

export default (props) => {
  const theme = useTheme();
  theme.zIndex.appBar = 1201; // One higher than the nav bar

  return (
    <AppBar position="fixed" style={{ background: lightBlue[900] }}>
      <Toolbar>
      {props.menu()}
        <Typography variant="h6" noWrap>
          PLACEHOLDER Tool
        </Typography>
      </Toolbar>
    </AppBar>
  )
}