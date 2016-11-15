import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import groupsReducer from './groupsReducer';
import candidatesReducer from './candidatesReducer';
import courtCasesReducer from './courtCasesReducer';
import ordureReducer from './personDetailsReducer';

const rootReducer = combineReducers({
    routing: routerReducer,
    groupsNode : groupsReducer,
    candidatesNode : candidatesReducer,
    courtCasesNode : courtCasesReducer,
    ordureNode: ordureReducer
});

export default rootReducer;
