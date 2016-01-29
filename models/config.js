// jscs:disable disallowKeywords
import { oneToOne, Model } from 'redux-orm';

export class Config extends Model {}
Config.modelName = 'Config';
Config.fields = {
  dj: oneToOne('DJ', 'config')
};
