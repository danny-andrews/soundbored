import config from 'app/util/config';
import {TEST_FILENAME} from 'test/factories/sounds';

window.TEST_GLOBALS = {};

// If running tests locally in virtual DOM (jsdom), fetch file from filesystem
//   else make legit request to public path serving sounds.
const TEST_SONG_PATH = window.jsdom
  ? [
    'file:/',
    config.get('PROJECT_ROOT'),
    'test',
    'public',
    'sounds',
    'wow.mp3'
  ].join(config.get('LOCAL_PATH_SEP'))
  : [config.get('ASSET_PATH'), 'sounds', TEST_FILENAME].join('/');

// This gets run before any test gets run. It fetches the test file saved in the
//   test asset path and caches the resulting blob, whose value can be used when
//   mocking any other request to retrieve audio files.
before(function() {
  return window.fetch(TEST_SONG_PATH)
    .then(response => response.blob())
    .then(blob => {
      window.TEST_GLOBALS.soundReqMockData = blob;
    });
});
