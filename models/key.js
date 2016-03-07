// jscs:disable disallowKeywords
import { Model } from 'redux-orm';

export class Key extends Model {
  displayCode() {
    return `${this.code.slice(0, 3)} ${this.code.charAt(3)}`;
  }
}
Key.modelName = 'Key';
