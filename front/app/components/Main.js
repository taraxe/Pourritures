import React from 'react';

import Header from './Header.js';
import Footer from './Footer.js';

class Main extends React.Component {

  render() {
    return (
      <div id='wrapper'>
        <div id='page-wrapper' className='gray-bg'>
          <Header/>
          <div className='wrapper wrapper-content'>
            <div className='container'>
              {this.props.children}
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default Main;
