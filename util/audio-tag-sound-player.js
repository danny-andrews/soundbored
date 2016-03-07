import assert from 'arg-assert';
import i from 'icepick';
import { range } from 'lodash';

import Pool from 'app/util/resource-pool';

const POOL_SIZE = 10;

export default function AudioTagSoundPlayer(filepath) {
  let activePlayers = i.freeze([]);
  let pool;

  function soundLoaded() {
    return Boolean(AudioTagSoundPlayer.audioCache[filepath]);
  }

  function setup() {
    const resourcePromises = range(POOL_SIZE - 1).map(num => {
      const tag = document.createElement('audio');
      return new Promise(resolve => {
        tag.onloadeddata = () => resolve({id: num, tag});
        tag.src = filepath;
      });
    });
    return Promise.all(resourcePromises).then(resources => {
      pool = Pool(resources);
      resources.forEach(({id, tag}) => {
        tag.onended = () => pool.free(id);
      });
      AudioTagSoundPlayer.audioCache =
            i.set(AudioTagSoundPlayer.audioCache, filepath, 'fake');
      return this;
    });
  }
  function load() {
    assert(soundLoaded(), 'You must call "setup" before calling "load" on ' +
        'a Sound instance');
    return Promise.resolve({
      start() {
        activePlayers = i.push(activePlayers, this);
        const {tag} = pool.busy();
        tag.play();
      },
      stop() {}
    });
  }
  function stopAll() {
    activePlayers.forEach(player => player.stop());
    activePlayers = i.freeze([]);
  }

  return Object.freeze({setup, load, stopAll});
}

AudioTagSoundPlayer.audioCache = i.freeze({});

AudioTagSoundPlayer.clearCache = function() {
  AudioTagSoundPlayer.audioCache = i.freeze({});
};
