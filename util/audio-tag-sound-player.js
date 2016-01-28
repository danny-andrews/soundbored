import assert from 'arg-assert';
import i from 'icepick';

export default function AudioTagSoundPlayer(filepath) {
  let activePlayers = i.freeze([]);

  function soundLoaded() {
    return Boolean(AudioTagSoundPlayer.audioCache[filepath]);
  }

  function setup() {
    AudioTagSoundPlayer.audioCache =
          i.set(AudioTagSoundPlayer.audioCache, filepath, 'fake');
    return Promise.resolve(this);
  }
  function load() {
    assert(soundLoaded(), 'You must call "setup" before calling "load" on ' +
        'a Sound instance');
    return Promise.resolve({
      start() {
        activePlayers = i.push(activePlayers, this);
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
