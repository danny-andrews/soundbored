import { createAction } from 'redux-actions';

import * as ATS from 'app/constants/action-types';

export const assignShortcutKeys = createAction(ATS.ASSIGN_SHORTCUT_KEYS);

export const createBoard = createAction(ATS.CREATE_BOARD);
export const createSound = createAction(ATS.CREATE_SOUND);
