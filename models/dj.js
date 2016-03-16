// jscs:disable disallowKeywords
import { oneToOne, Model } from 'redux-orm';

export class Dj extends Model {}
Dj.modelName = 'Dj';
Dj.fields = {
  config: oneToOne('Config', 'dj')
};
