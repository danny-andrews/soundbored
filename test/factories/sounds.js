import assert from 'arg-assert';
import config from 'app/util/config';
import {Factory} from 'rosie';
import {ShortcutModelFac} from './shortcuts';
import {Sound} from 'app/models';

export const TEST_FILENAME = 'wow.mp3';

export const SoundFac = new Factory()
  .sequence('id')
  .sequence('boardId')
  .attr('displayName', 'Woof!')
  .option('suppressWarning', false)
  .attr('filename', [
    'filename',
    'suppressWarning'
  ], (filename, suppressWarning) => {
    if(filename) {
      assert(
        suppressWarning || config.get('NODE_ENV') !== 'test',
        "[Sound Factory]: Don't set a custom filename, so as to avoid 404's"
          + ' when rendering audio tags in tests'
      );

      return filename;
    }
    else {
      return TEST_FILENAME;
    }
  })
  .attr('playCount', 0);

export const SoundModelFac = new Factory(attrs => Sound.create(attrs))
  .extend(SoundFac)
  .attr('shortcut', ['id', 'shortcut'], (id, shortcut) =>
    (shortcut ? shortcut : ShortcutModelFac.build({shortcut: id})));
