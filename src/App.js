import React from 'react';

import Graph from './components/graph'
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {data: []}
  }

  render() {
    return (
      <div className="App">
          <Graph/>
      </div>
        
    );
  }

}
