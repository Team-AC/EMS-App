import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';

export default () => {
  const theme = useTheme();
  theme.zIndex.appBar = 1201; // One higher than the nav bar
  
  return (
    <AppBar position="fixed" >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Energy Management System
        </Typography>
      </Toolbar>
    </AppBar>
  )
}