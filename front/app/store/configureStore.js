import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { routerMiddleware } from 'react-router-redux';


const store = createStore(rootReducer, compose(
    applyMiddleware(
        routerMiddleware(browserHistory, thunk),
        thunk,
        createLogger()
    ), window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
