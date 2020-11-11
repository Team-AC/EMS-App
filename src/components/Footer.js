import React from "react";
import axios from "axios"
import {BottomNavigation, BottomNavigationAction, Container} from '@material-ui/core';


export default class Footer extends React.Component {
  render(){
    return(
    <BottomNavigation showLabels>
      <BottomNavigationAction label = "About Us"/>
      <BottomNavigationAction label = "Contact Us"/>

    </BottomNavigation>
      
    
      

    )
  }
}
