import { makeStyles, useTheme} from '@material-ui/core/styles'
import {Button} from '@material-ui/core';


export default () => {
  const theme = useTheme();

  return(
    <div style={{marginTop:"70px"}}>
      <Button variant = "contained" color="primary">Generate</Button>
      <Button 
        variant = "contained"
        color="secondary" 
        disabled
        style = {{marginLeft:"50px"}}
      >
        Delete
      </Button>
    </div>
  )
}