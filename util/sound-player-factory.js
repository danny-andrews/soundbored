import AudioContextSoundPlayer from './audio-context-sound-player';
import AudioTagSoundPlayer from './audio-tag-sound-player';
import { detectFeature } from 'app/util/feature-detector';

export default function Factory(filepath) {
  return detectFeature('audio-api') ?
    AudioContextSoundPlayer(filepath) :
    AudioTagSoundPlayer(filepath);
}

Factory.clearCache = (function() {
  return detectFeature('audio-api') ?
    AudioContextSoundPlayer.clearCache :
    AudioTagSoundPlayer.clearCache;
})();
