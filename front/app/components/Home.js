import React from 'react';
import {Link} from 'react-router';

class Home extends React.Component {

  render() {
    return (
      <div>
          <h1>Some title</h1>
          <p>Some motto</p>
          {/*<Link to='/playerOne'>
            <button type='button'>Get started</button>
          </Link>*/}
      </div>
    );
  }
};

export default Home;
