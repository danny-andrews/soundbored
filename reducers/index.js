import { combineReducers } from 'redux';

import entities from './entities';
import previousAction from './previous-action';

const rootReducer = combineReducers({entities, previousAction});

export default rootReducer;
