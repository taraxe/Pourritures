import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';


const store = createStore(rootReducer, compose(
    applyMiddleware(
        thunk,
        createLogger()
    ), window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
