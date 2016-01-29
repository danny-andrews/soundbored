// jscs:disable disallowKeywords
import { many, oneToOne, Model } from 'redux-orm';

export class Sound extends Model {}
Sound.modelName = 'Sound';
Sound.fields = {
  boards: many('Board', 'sounds'),
  shortcut: oneToOne('shortcut', 'sound')
};
