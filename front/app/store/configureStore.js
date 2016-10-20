import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
//import promise from 'redux-promise';
import rootReducer from '../reducers';
import { routerMiddleware } from 'react-router-redux';


const store = createStore(rootReducer, compose(
    applyMiddleware(
        routerMiddleware(browserHistory, thunk),
        //promise,
        createLogger()
    ), window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
