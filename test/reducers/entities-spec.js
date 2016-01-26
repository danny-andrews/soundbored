import expect from 'expect';

import { playSound } from 'app/actions';
import subject from 'app/reducers/entities';
import { ActionFac, SoundFac } from 'test/factories';

function actionResponseFactory(entitiesHash = {}) {
  return {response: {entities: entitiesHash}};
}

describe('Reducer - entities', function() {
  it('uses default state value when state is falsy', function() {
    const newState = subject(
      undefined,
      actionResponseFactory({
        items: {
          2: {id: 2, name: 'shoes'}
        }
      })
    );
    expect(newState.items[2]).toExist();
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
      {
        items: {
          1: {id: 1, name: 'hat'}
        }
      },
      actionResponseFactory({
        items: {
          2: {id: 2, name: 'shoes'}
        },
        customers: {
          4: {id: 4, name: 'Marcus'}
        }
      })
    );
    expect(newState).toEqual({
      items: {
        1: {id: 1, name: 'hat'},
        2: {id: 2, name: 'shoes'}
      },
      customers: {
        4: {id: 4, name: 'Marcus'}
      }
    });
  });

  it('overwrites existing state with api action response data', function() {
    const newState = subject(
      {
        items: {
          1: {id: 1, name: 'hat'}
        }
      }, actionResponseFactory({
        items: {
          1: {id: 1, name: 'cap'}
        }
      })
    );
    expect(newState).toEqual({
      items: {
        1: {id: 1, name: 'cap'}
      }
    });
  });

  it('merges existing state with api action response data', function() {
    const newState = subject(
      {
        items: {
          1: {id: 1, name: 'hat'}
        }
      },
      actionResponseFactory({
        items: {
          1: {id: 1, price: 300}
        }
      })
    );
    expect(newState).toEqual({
      items: {
        1: {id: 1, name: 'hat', price: 300}
      }
    });
  });

  context('action.type === PLAY_SOUND', function() {
    it('increases playCount of the played sound', function() {
      const newState = subject(
        {
          sounds: {
            1: SoundFac.build({id: 1, playCount: 3})
          }
        },
        playSound(1)
      );
      const selectedSound = newState.sounds[1];
      expect(selectedSound.playCount).toBe(4);
    });
  });
});
