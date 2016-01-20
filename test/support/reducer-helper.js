import cloneDeep from 'lodash/cloneDeep';
import { isEqual } from 'lodash';

// This helper is for testing reducer functions. It has logic to ensure the
//   passed in 'state' and 'action' params are not modified by the reducer
//   function.
export default function(reducer) {
  function reduce(state, action) {
    const oldState = cloneDeep(state);
    const oldAction = cloneDeep(action);
    const res = reducer(state, action);
    if(!isEqual(state, oldState)) {
      throw new Error('The reducer under test modified the passed-in state. ' +
        'This means your reducer is not pure!');
    }
    if(!isEqual(action, oldAction)) {
      throw new Error('The reducer under test modified the passed-in action. ' +
        'This means your reducer is not pure!');
    }
    return res;
  }

  return Object.freeze({reduce});
}
