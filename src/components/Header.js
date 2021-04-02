import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import { lightBlue } from "@material-ui/core/colors";
import React from 'react';
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";



export default (props) => {
  const headerHeight = props.headerHeight;
  const theme = useTheme();

  theme.zIndex.appBar = 1201; // One higher than the nav bar

  return (
    <AppBar position="fixed" style={{minHeight: 0, background: lightBlue[900], height: headerHeight }}>
      <Toolbar>
      {props.menu()}
        <Typography variant="h6" noWrap>
          OUR PLATFORM (PLACEHOLDER)
        </Typography>
      </Toolbar>
    </AppBar>
  )
}