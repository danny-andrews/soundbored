import {applyMiddleware, compose, createStore} from 'redux';
import {DEMO_ENTITIES, STUB_DATA} from 'test/factories';
import api from 'app/middleware/api';
import config from 'app/util/config';
import delayResponse from 'app/middleware/delay-response';
import DevTools from 'app/containers/dev-tools';
import rootReducer from 'app/reducers';
import schema from 'app/store/schema';
import stateMutationGuardMiddleware from 'redux-immutable-state-invariant';
import stubber from 'fetch-mock';
import thunk from 'redux-thunk';

const INITIAL_STATE = {entities: DEMO_ENTITIES};
const DELAY_AMOUNT = 1000;
const delay = config.inTest() ? 0 : DELAY_AMOUNT;

const entitiesToJsonApiReponse = (entities, type) => entities.map(entity =>
  ({
    type,
    id: entity.id,
    attributes: entity
  })
);

function stubRequests() {
  stubber.mock([
    {
      name: 'authenticate',
      matcher: /\/login/,
      response: {
        data: {type: 'session', id: 1, attributes: {token: 'fhoiewa9'}}
      }
    },
    {
      name: 'getKeys',
      matcher: /\/keys/,
      response: {
        data: entitiesToJsonApiReponse(STUB_DATA.Key, 'key')
      }
    },
    {
      name: 'getBoards',
      matcher: /\/boards$/,
      response: {
        data: entitiesToJsonApiReponse(STUB_DATA.Board, 'board')
      }
    },
    {
      name: 'getBoardSounds',
      matcher: /\/boards\/\d+\/sounds/,
      response: {
        data: entitiesToJsonApiReponse(STUB_DATA.Sound, 'sound')
      }
    },
    {
      name: 'getShortcutCommands',
      matcher: /shortcut-commands/,
      response: {
        data: entitiesToJsonApiReponse(
          STUB_DATA.ShortcutCommand,
          'shortcutCommand'
        )
      }
    }
  ]);
}

if(config.inDev()) {
  stubRequests();
}

const finalCreateStore = compose(
  applyMiddleware(
    stateMutationGuardMiddleware(),
    thunk,
    api,
    delayResponse(delay)
  ),
  DevTools.instrument()
)(createStore);

export default function(initialState = INITIAL_STATE) {
  const store = finalCreateStore(rootReducer, initialState);
  const session = schema.from(store.getState().entities);
  store.session = () => session;

  return store;
}
