import { createStore, applyMiddleware, compose } from 'redux';
import stateMutationGuardMiddleware from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import DevTools from 'app/containers/dev-tools';
import rootReducer from 'app/reducers';
import { SoundFac } from 'test/factories';

const INITIAL_STATE = {
  entities: {
    sounds: {
      1: SoundFac.build({id: 1}),
      2: SoundFac.build({id: 2})
    }
  }
};

const finalCreateStore = compose(
  applyMiddleware(stateMutationGuardMiddleware(), thunk),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState = INITIAL_STATE) {
  return finalCreateStore(rootReducer, initialState);
}
