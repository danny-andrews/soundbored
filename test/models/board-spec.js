import expect from 'expect';

import schema from 'app/store/schema';
import { DjModelFac, BoardModelFac, SoundModelFac } from 'test/factories';

describe('Model - board', function() {
  beforeEach(function() {
    const state = schema.getDefaultState();
    schema.withMutations(state);
  });

  it('belongs to dj', function() {
    const dj = DjModelFac.build({id: 4});
    const board = BoardModelFac.build({id: 1, dj});
    expect(board.dj.equals(dj)).toBe(true);
  });

  it('has sounds many-to-many relationship', function() {
    const sound = SoundModelFac.build({id: 4});
    const board = BoardModelFac.build({id: 1, sounds: [sound]});
    expect(board.sounds.first().equals(sound)).toBe(true);
  });
});
