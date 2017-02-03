import {many, Model, oneToOne} from 'redux-orm';

export class Sound extends Model {}
Sound.modelName = 'Sound';
Sound.fields = {
  boards: many('Board', 'sounds'),
  shortcut: oneToOne('shortcut', 'sound')
};
