import expect from 'expect';

import schema from 'app/store/schema';
import { DjModelFac, BoardModelFac, SoundModelFac } from 'test/factories';

describe('Model - board', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('belongs to dj', function() {
    const dj = DjModelFac.build();
    const board = BoardModelFac.build({dj});
    expect(board.dj.equals(dj)).toBe(true);
  });

  it('has sounds many-to-many relationship', function() {
    const sounds = SoundModelFac.buildList(1);
    const board = BoardModelFac.build({sounds});
    expect(board.sounds.first().equals(sounds[0])).toBe(true);
  });
});
