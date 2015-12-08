import { PLAY_SOUND } from '../actions/board';

export default function board(state = 0, action) {
  switch(action.type) {
    case PLAY_SOUND:
      return state;
    default:
      return state;
  }
}
