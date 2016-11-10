import React from 'react';
import C3Chart from 'react-c3js';

class GroupChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      const data = {
          columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 50, 20, 10, 40, 15, 25]
          ]
      };
      const options = {};
      const type = "bar";

      return (<C3Chart data={data} type="bar" options={options} />)
  }
}

export default GroupChart
