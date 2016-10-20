import React from 'react';
import {Link} from 'react-router';
import alternance from '../data/alternance.json';

class Home extends React.Component {

  render() {
    const rows = alternance.map(a => <li>{a.gouv}</li>);
    return (
      <div>
          <h1>Some title</h1>
          <p>Some motto</p>
          <ul>{rows}</ul>
      </div>
    );
  }
};

export default Home;
