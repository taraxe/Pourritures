import { combineReducers } from 'redux';
import chartReducer from './chartReducer';
import candidatesReducer from './candidatesReducer';
import courtCasesReducer from './courtCasesReducer';
import ordureReducer from './personDetailsReducer';
import contributorsReducer from './contributorsReducer';
import statsReducer from './statsReducer';

const rootReducer = combineReducers({
    chartsNode : chartReducer,
    candidatesNode : candidatesReducer,
    courtCasesNode : courtCasesReducer,
    ordureNode: ordureReducer,
    contributorsNode : contributorsReducer,
    statsNode : statsReducer
});

export default rootReducer;
