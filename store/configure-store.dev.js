import { createStore, applyMiddleware, compose } from 'redux';
import stateMutationGuardMiddleware from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import { values } from 'lodash';

import config from 'app/util/config';
import DevTools from 'app/containers/dev-tools';
import rootReducer from 'app/reducers';
import { SoundFac } from 'test/factories';

const TEST_SOUNDS = config.inDev() ?
  values(config.get('SOUNDFILES')
    .map((filename, id) =>
      SoundFac.build({
        id,
        filename,
        displayName: filename.split('.')[0]
      })
    )) :
    [];

const INITIAL_STATE = {
  entities: {sounds: TEST_SOUNDS}
};

const finalCreateStore = compose(
  applyMiddleware(stateMutationGuardMiddleware(), thunk),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState = INITIAL_STATE) {
  return finalCreateStore(rootReducer, initialState);
}
