import { createAction } from 'redux-actions';

import { PLAY_SOUND } from 'app/constants';

export const playSound = createAction(PLAY_SOUND);
