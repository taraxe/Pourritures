import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../store/configureStore';
import PersonDetailsContainer from '../containers/PersonDetailContainer';

const history = syncHistoryWithStore(browserHistory, store);

import Main from '../components/Main';
import Home from '../components/Home';

const Routes = (
  <Router history={history}>
    <Route path='/' component={Main}>
        <IndexRoute component={Home}/>
        <Route path='ordures/:slug' header='Ordure' component={PersonDetailsContainer}/>
        {/*<Route path='playerTwo/:playerOne' header='Player Two' component={PromptContainer}/>
        <Route path='battle' component={ConfirmBattleContainer}/>
        <Route path='results' component={ResultsContainer}/>*/}
    </Route>
  </Router>
);

export default Routes;
