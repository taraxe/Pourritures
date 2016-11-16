import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

class GroupChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
          <C3Chart data={this.props.data}/>
      )
  }
}

export default GroupChart
