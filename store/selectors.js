import { createSelector, defaultMemoize } from 'reselect';
import { reduce } from 'lodash';

import config from 'app/util/config';
import SoundPlayerFactory from 'app/util/sound-player-factory';
import schema from 'app/store/schema';

function soundPath(filename) {
  return [config.get('ASSET_PATH'), 'sounds', filename].join('/');
}

export const sounds = schema.createSelector(session =>
  session.Sound.all().toModelArray()
);

export const soundPlayersSelector = createSelector(
  sounds,
  defaultMemoize(
    sounds => reduce(sounds, (acc, sound) => {
      acc[sound.id] = SoundPlayerFactory(soundPath(sound.filename)).setup();
      return acc;
    }, {}),
    (a, b) =>
      a.every((sound, index) =>
        sound.id === b[index].id && sound.filename === b[index].filename
      )
  )
);
