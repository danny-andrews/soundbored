import assert from 'arg-assert';
import 'fetch';
import i from 'icepick';

import { detectFeature, normalizeFeature } from 'app/util/feature-detector';
import { error } from 'app/util/logger';

function HTMLSoundPlayer() {
  function setup() {
    return Promise.resolve(this);
  }
  function load() {
    return Promise.resolve({start() {}});
  }
  return Object.freeze({setup, load});
}

const AudioContext = normalizeFeature('audio-api') || function() {};
const audioContext = new AudioContext();

let audioCache = i.freeze({});

function AudioContextSoundPlayer(filepath) {
  function decodeAudioData(audioContext, data) {
    return new Promise((resolve, reject) =>
      audioContext.decodeAudioData(data, resolve, reject)
    );
  }

  function createPlayer(opts = {}) {
    const {decodedAudioData} = opts;
    const source = audioContext.createBufferSource();
    source.buffer = decodedAudioData;
    source.connect(audioContext.destination);
    return source;
  }

  function soundLoaded() {
    return Boolean(audioCache[filepath]);
  }

  function setup() {
    if(soundLoaded()) {
      return Promise.resolve(this);
    }

    return window.fetch(filepath).then(response => response.arrayBuffer())
      .then(arrayBuffer => decodeAudioData(audioContext, arrayBuffer))
      .then(decodedData => {
        audioCache = i.set(audioCache, filepath, decodedData);
        return this;
      })
      .catch(err => error(`Error decoding audio data ${err}`));
  }

  function load() {
    assert(soundLoaded(), 'You must call "setup" before calling "load" on ' +
      'a Sound instance');
    return Promise.resolve(
      createPlayer({decodedAudioData: audioCache[filepath]})
    );
  }

  return Object.freeze({setup, load});
}

export default function(filepath) {
  return detectFeature('audio-api') ?
    AudioContextSoundPlayer(filepath) :
    HTMLSoundPlayer(filepath);
}
