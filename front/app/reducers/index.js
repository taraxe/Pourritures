import { combineReducers } from 'redux';
import groupsReducer from './groupsReducer';
import candidatesReducer from './candidatesReducer';
import courtCasesReducer from './courtCasesReducer';
import ordureReducer from './personDetailsReducer';
import contributorsReducer from './contributorsReducer';

const rootReducer = combineReducers({
    groupsNode : groupsReducer,
    candidatesNode : candidatesReducer,
    courtCasesNode : courtCasesReducer,
    ordureNode: ordureReducer,
    contributorsNode : contributorsReducer
});

export default rootReducer;
