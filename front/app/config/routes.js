import React from 'react';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';
import PersonDetailsContainer from '../containers/PersonDetailContainer';
import About from '../components/About';
import Contribute from '../components/Contribute';
import Impulse from '../components/Impulse';

import Main from '../components/Main';
import Home from '../components/Home';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-32862303-4');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

const Routes = (
  <Router history={browserHistory} onUpdate={() => {window.scrollTo(0, 0); logPageView();}}>
    <Route path='/' component={Main}>
        <IndexRoute component={Home}/>
        <Route path='ordures/:slug' header='Ordure' component={PersonDetailsContainer}/>
        <Route path='contribute' header='Contribuer' component={Contribute}/>
        <Route path='impulse' header='Influer' component={Impulse}/>
        <Route path='about' header='A propos' component={About}/>
        <Redirect from="*" to="/" />
    </Route>
  </Router>
);

export default Routes;
