import assert from 'arg-assert';
import { Factory } from 'rosie';

import { Sound } from 'app/models';
import { ShortcutModelFac } from './shortcuts';

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
    if(Boolean(filename)) {
      assert(
        suppressWarning || process.env.NODE_ENV !== 'test',
        "[Sound Factory]: Don't set a custom filename, so as to avoid 404\'s" +
          ' when rendering audio tags in tests'
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
    shortcut ? shortcut : ShortcutModelFac.build({shortcut: id}));
