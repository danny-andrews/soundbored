import { Factory } from 'rosie';

export const SoundFac = new Factory()
  .sequence('id')
  .sequence('boardId')
  .attr('displayName', 'Woof!')
  .attr('filename', ['filename'], function(filename) {
    if(Boolean(filename)) {
      console.warn("[Sound Factory]: Don't set a custom filename unless you " +
        "have to, to avoid 404\'s when rednering SoundPlayer components");
      return filename;
    }
    else {
      return 'woof.mp3';
    }
  })
  .attr('playCount', 0);
