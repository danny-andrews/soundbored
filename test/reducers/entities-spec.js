import expect from 'expect';
import infect from 'infect';

import 'test/test-helper';
import schema from 'app/store/schema';
import { playSound } from 'app/actions';
import subject, { entityMapToOrmData } from 'app/reducers/entities';
import { ActionFac, SoundFac } from 'test/factories';

infect.set('ResponseDataTransformer', f => f);

function actionResponseFactory(entitiesHash = {}) {
  return {response: {data: entitiesHash}};
}

function stateFactory(state) {
  state = entityMapToOrmData(state);
  schema.from(state);
  return state;
}

describe('Reducer - entities', function() {
  it('uses default state value when state is falsy', function() {
    const newState = subject(
      undefined,
      actionResponseFactory({
        DJ: [{id: 2, name: 'shoes'}]
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
        items: [{id: 1, name: 'hat'}],
        customers: []
      }),
      actionResponseFactory({
        items: [{id: 2, name: 'shoes'}],
        customers: [{id: 4, name: 'Marcus'}]
      })
    );
    expect(newState.Items.itemsById).toEqual({
      1: {id: 1, name: 'hat'},
      2: {id: 2, name: 'shoes'}
    });
    expect(newState.Items.items.sort()).toEqual(['1', '2']);
    expect(newState.Customers.itemsById).toEqual({
      4: {id: 4, name: 'Marcus'}
    });
    expect(newState.Customers.items).toEqual(['4']);
  });

  it('overwrites existing state with api action response data', function() {
    const newState = subject(
      stateFactory({
        items: [{id: 1, name: 'hat'}]
      }),
      actionResponseFactory({
        items: [{id: 1, name: 'cap'}]
      })
    );
    expect(newState.Items.itemsById).toEqual({
      1: {id: 1, name: 'cap'}
    });
    expect(newState.Items.items).toEqual(['1']);
  });

  it('merges existing state with api action response data', function() {
    const newState = subject(
      stateFactory({
        items: [{id: 1, name: 'hat'}]
      }),
      actionResponseFactory({
        items: [{id: 1, price: 300}]
      })
    );
    expect(newState.Items.itemsById).toEqual({
      1: {id: 1, name: 'hat', price: 300}
    });
    expect(newState.Items.items).toEqual(['1']);
  });

  it('capitalizes entity type', function() {
    const newState = subject(
      stateFactory({
        items: [{id: 1, name: 'hat'}]
      }),
      actionResponseFactory({
        items: [{id: 1, price: 300}]
      })
    );
    expect(newState.Items.itemsById).toEqual({
      1: {id: 1, name: 'hat', price: 300}
    });
    expect(newState.Items.items).toEqual(['1']);
  });

  context('action.type === PLAY_SOUND', function() {
    it('increases playCount of the played sound', function() {
      const state = stateFactory({
        Sound: [SoundFac.build({id: 1, playCount: 3})]
      });
      const newState = subject(state, playSound(1));
      const selectedSound = newState.Sound.itemsById[1];
      expect(selectedSound.playCount).toBe(4);
    });
  });
});
