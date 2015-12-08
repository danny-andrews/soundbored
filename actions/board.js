import * as types from '../constants/action-types';

export function playSound(id) {
  return {type: types.PLAY_SOUND, id};
}
