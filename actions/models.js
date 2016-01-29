import { createAction } from 'redux-actions';

import { ASSIGN_SHORTCUT_KEYS } from 'app/constants/action-types';

export const assignShortcutKeys = createAction(ASSIGN_SHORTCUT_KEYS);
