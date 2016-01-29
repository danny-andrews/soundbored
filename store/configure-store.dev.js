import { createStore, applyMiddleware, compose } from 'redux';
import stateMutationGuardMiddleware from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import DevTools from 'app/containers/dev-tools';
import rootReducer from 'app/reducers';
import { TEST_ENTITIES } from 'test/factories';

const INITIAL_STATE = {entities: TEST_ENTITIES};

const finalCreateStore = compose(
  applyMiddleware(stateMutationGuardMiddleware(), thunk),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState = INITIAL_STATE) {
  return finalCreateStore(rootReducer, initialState);
}
