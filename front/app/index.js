import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import routes from './config/routes';
import store from './store/configureStore';

/*
FIRST :
		Focused
		Independant
		Reusable
		Small
		Testable
		*/
import './../node_modules/bootstrap/dist/css/bootstrap.min.css'

const Router = (props) => routes;
render(
		<Provider store={store}>
			<Router/>
		</Provider>,
	document.getElementById('app')
);
