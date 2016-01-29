// jscs:disable disallowKeywords
import { oneToOne, Model } from 'redux-orm';

export class DJ extends Model {}
DJ.modelName = 'DJ';
DJ.fields = {
  config: oneToOne('Config', 'dj')
};
