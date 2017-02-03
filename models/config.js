import {Model, oneToOne} from 'redux-orm';

export class Config extends Model {}
Config.modelName = 'Config';
Config.fields = {
  dj: oneToOne('Dj', 'config')
};
