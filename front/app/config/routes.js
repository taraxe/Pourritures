import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import Main from '../components/Main';
import Home from '../components/Home';

const Routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Main}>
        <IndexRoute component={Home}/>
        {/*<Route path='playerOne' header='Player One' component={PromptContainer}/>
        <Route path='playerTwo/:playerOne' header='Player Two' component={PromptContainer}/>
        <Route path='battle' component={ConfirmBattleContainer}/>
        <Route path='results' component={ResultsContainer}/>*/}
    </Route>
  </Router>
);

export default Routes;
