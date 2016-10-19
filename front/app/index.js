import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//import promise from 'redux-promise';
import rootReducer from './reducers';
import routes from './config/routes';


/*
FIRST :
		Focused
		Independant
		Reusable
		Small
		Testable
		*/

function configureStore() {
	return createStore(rootReducer, compose(
			applyMiddleware(
      	thunk,
				//promise,
      	createLogger()
			), window.devToolsExtension ? window.devToolsExtension() : f => f
	));
}

const store = configureStore();
const App = (props) => routes;

render(
		<Provider store={store}>
			<App/>
		</Provider>,
	document.getElementById('app')
);
