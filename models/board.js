// jscs:disable disallowKeywords
import { many, fk, Model } from 'redux-orm';

export class Board extends Model {}
Board.modelName = 'Board';
Board.fields = {
  sounds: many('Sound', 'boards'),
  dj: fk('DJ', 'boards')
};
