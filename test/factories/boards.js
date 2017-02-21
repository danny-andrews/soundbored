import {Board} from 'app/models';
import {DjModelFac} from './djs';
import {Factory} from 'rosie';

export const BoardFac = new Factory()
  .sequence('id')
  .sequence('name', i => `Board${i}`);

export const BoardModelFac = new Factory(attrs => Board.create(attrs))
  .extend(BoardFac)
  .attr('dj', ['dj'], dj => (dj ? dj : DjModelFac.build()));
