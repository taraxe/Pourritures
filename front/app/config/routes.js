import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import store from '../store/configureStore';
import PersonDetailsContainer from '../containers/PersonDetailContainer';
import About from '../components/About';

import Main from '../components/Main';
import Home from '../components/Home';

const Routes = (
  <Router history={browserHistory}>
    <Route path='/' component={Main}>
        <IndexRoute component={Home}/>
        <Route path='ordures/:slug' header='Ordure' component={PersonDetailsContainer}/>
        <Route path='about' header='A propos' component={About}/>
    </Route>
  </Router>
);

export default Routes;
