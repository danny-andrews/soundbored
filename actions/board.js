import { createAction } from 'redux-actions';

import { PLAY_SOUND, KILL_ALL_SOUNDS } from 'app/constants';

export const playSound = createAction(PLAY_SOUND);

export const killAllSounds = createAction(KILL_ALL_SOUNDS);
