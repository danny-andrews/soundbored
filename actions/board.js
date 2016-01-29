import { createAction } from 'redux-actions';

import { PLAY_SOUND, KILL_ALL_SOUNDS, KEY_PRESS } from 'app/constants';

export const playSound = createAction(PLAY_SOUND);
export const killAllSounds = createAction(KILL_ALL_SOUNDS);
export const keyPress = createAction(KEY_PRESS);
