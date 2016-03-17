import assert from 'arg-assert';
import 'fetch';
import i from 'icepick';

import { normalizeFeature } from 'app/util/feature-detector';
import { error } from 'app/util/logger';

const AudioContext = normalizeFeature('audio-api') || function() {};
const audioContext = new AudioContext();

export default function AudioContextSoundPlayer(filepath) {
  let activePlayers = i.freeze([]);

  function DecoratedAudioBufferSourceNode(node) {
    function start(...args) {
      activePlayers = i.push(activePlayers, this);
      node.start(...args);
      return new Promise(resolve => node.onended = resolve);
    }
    function stop() {
      node.stop();
    }

    return {start, stop};
  }

  function decodeAudioData(data) {
    return new Promise((resolve, reject) =>
      audioContext.decodeAudioData(data, resolve, reject)
    );
  }

  function createPlayer(opts = {}) {
    const {decodedAudioData} = opts;
    const source = audioContext.createBufferSource();
    source.buffer = decodedAudioData;
    source.connect(audioContext.destination);
    return DecoratedAudioBufferSourceNode(source);
  }

  function soundLoaded() {
    return Boolean(AudioContextSoundPlayer.audioCache[filepath]);
  }

  function setup() {
    if(soundLoaded()) {
      return Promise.resolve(this);
    }

    return window.fetch(filepath).then(response => response.arrayBuffer())
      .then(arrayBuffer => decodeAudioData(arrayBuffer))
      .then(decodedData => {
        AudioContextSoundPlayer.audioCache =
          i.set(AudioContextSoundPlayer.audioCache, filepath, decodedData);
        return this;
      })
      .catch(err => error(`Error decoding audio data ${err}`));
  }

  function load() {
    assert(soundLoaded(), 'You must call "setup" before calling "load" on ' +
      'a Sound instance');
    return Promise.resolve(
      createPlayer({
        decodedAudioData: AudioContextSoundPlayer.audioCache[filepath]
      })
    );
  }

  function stopAll() {
    activePlayers.forEach(player => player.stop());
    activePlayers = i.freeze([]);
  }

  return Object.freeze({setup, load, stopAll, filepath});
}

AudioContextSoundPlayer.audioCache = i.freeze({});

AudioContextSoundPlayer.clearCache = function() {
  AudioContextSoundPlayer.audioCache = i.freeze({});
};
