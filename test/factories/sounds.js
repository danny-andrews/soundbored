import assert from 'arg-assert';
import { Factory } from 'rosie';

export const SoundFac = new Factory()
  .sequence('id')
  .sequence('boardId')
  .attr('displayName', 'Woof!')
  .attr('filename', ['filename'], function(filename) {
    if(Boolean(filename)) {
      assert(
        process.env.NODE_ENV !== 'test',
        "[Sound Factory]: Don't set a custom filename, so as to avoid 404\'s" +
          ' when rendering audio tags in tests'
      );
      return filename;
    }
    else {
      return 'wow.mp3';
    }
  })
  .attr('playCount', 0);
