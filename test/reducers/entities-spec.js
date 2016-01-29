import expect from 'expect';
import { transform } from 'lodash';

import schema from 'app/store/schema';
import { playSound } from 'app/actions';
import subject from 'app/reducers/entities';
import { ActionFac, SoundFac } from 'test/factories';

function actionResponseFactory(entitiesHash = {}) {
  return {response: {entities: entitiesHash}};
}

function stateFactory(state) {
  state = transform(state, (newState, idMap, entityType) =>
    newState[entityType] = {
      itemsById: idMap,
      items: Object.keys(idMap)
    }
  );
  schema.from(state);
  return state;
}

describe('Reducer - entities', function() {
  it('uses default state value when state is falsy', function() {
    const newState = subject(
      undefined,
      actionResponseFactory({
        DJ: {
          2: {id: 2, name: 'shoes'}
        }
      })
    );
    expect(newState.DJ.itemsById[2]).toExist();
  });

  it('ignores actions with no response key', function() {
    const oldState = {};
    const newState = subject(oldState, ActionFac.build());
    expect(newState).toEqual(oldState);
  });

  it('ignores actions with no response key', function() {
    const state = {};
    const newState = subject(state, ActionFac.build({response: null}));
    expect(newState).toEqual(state);
  });

  it('adds new data returned in an api action response', function() {
    const newState = subject(
      stateFactory({
        items: {
          1: {id: 1, name: 'hat'}
        },
        customers: {}
      }),
      actionResponseFactory({
        items: {
          2: {id: 2, name: 'shoes'}
        },
        customers: {
          4: {id: 4, name: 'Marcus'}
        }
      })
    );
    expect(newState.items.itemsById).toEqual({
      1: {id: 1, name: 'hat'},
      2: {id: 2, name: 'shoes'}
    });
    expect(newState.items.items.sort()).toEqual(['1', '2']);
    expect(newState.customers.itemsById).toEqual({
      4: {id: 4, name: 'Marcus'}
    });
    expect(newState.customers.items).toEqual(['4']);
  });

  it('overwrites existing state with api action response data', function() {
    const newState = subject(
      stateFactory({
        items: {
          1: {id: 1, name: 'hat'}
        }
      }), actionResponseFactory({
        items: {
          1: {id: 1, name: 'cap'}
        }
      })
    );
    expect(newState.items.itemsById).toEqual({
      1: {id: 1, name: 'cap'}
    });
    expect(newState.items.items).toEqual(['1']);
  });

  it('merges existing state with api action response data', function() {
    const newState = subject(
      stateFactory({
        items: {
          1: {id: 1, name: 'hat'}
        }
      }),
      actionResponseFactory({
        items: {
          1: {id: 1, price: 300}
        }
      })
    );
    expect(newState.items.itemsById).toEqual({
      1: {id: 1, name: 'hat', price: 300}
    });
    expect(newState.items.items).toEqual(['1']);
  });

  context('action.type === PLAY_SOUND', function() {
    it('increases playCount of the played sound', function() {
      const state = stateFactory({
        Sound: {
          1: SoundFac.build({id: 1, playCount: 3})
        }
      });
      const newState = subject(state, playSound(1));
      const selectedSound = newState.Sound.itemsById[1];
      expect(selectedSound.playCount).toBe(4);
    });
  });
});
