import {KEY_PRESS, KILL_ALL_SOUNDS, PLAY_SOUND} from 'app/constants';
import {createAction} from 'redux-actions';

export const playSound = createAction(PLAY_SOUND);
export const killAllSounds = createAction(KILL_ALL_SOUNDS);
export const keyPress = createAction(KEY_PRESS);
