import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import groupsReducer from './groupsReducer';
import candidatesReducer from './candidatesReducer';
import courtCasesReducer from './courtCasesReducer';

const rootReducer = combineReducers({
    routing: routerReducer,
    groupNode : groupsReducer,
    candidateNode : candidatesReducer,
    courtCaseNode : courtCasesReducer
});

export default rootReducer;
