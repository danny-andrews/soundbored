import assert from 'arg-assert';
import i from 'icepick';

function AudioAPI() {
  function normalize() {
    return window.AudioContext || window.webkitAudioContext;
  }
  function isSupported() {
    return Boolean(normalize());
  }
  return Object.freeze({isSupported, normalize});
}

const FEATURE_MAP = i.freeze({'audio-api': AudioAPI});

export function detectFeature(featureName) {
  assert(FEATURE_MAP[featureName], `Invalid feature name ${featureName} given`);
  return FEATURE_MAP[featureName]().isSupported();
}

export function normalizeFeature(featureName) {
  assert(FEATURE_MAP[featureName], `Invalid feature name ${featureName} given`);
  return FEATURE_MAP[featureName]().normalize();
}
