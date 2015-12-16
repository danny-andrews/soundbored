import { PLAY_SOUND } from '../constants/action-types';

export default function board(state = {}, action) {
  switch(action.type) {
    case PLAY_SOUND:
      return Object.assign({}, state);
    default:
      return state;
  }
}
