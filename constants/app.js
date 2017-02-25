import i from 'icepick';

export const API_VERSION = 'v1';

export const SHORTCUT_ACTIONS = i.freeze({
  PLAY_SOUND: 'PLAY_SOUND',
  KILL_ALL_SOUNDS: 'KILL_ALL_SOUNDS'
});

export const DEFAULT_ENTITY_STATE = {
  itemsById: {},
  items: [],
  haveBeenFetched: false,
  isFetching: false
}
