import {Factory} from 'rosie';

import {Key} from 'app/models';

const START_CODE = 65;

export const KeyFac = new Factory()
  .sequence('id')
  .sequence('code', i => `Key${String.fromCharCode(i + START_CODE - 1)}`);

export const KeyModelFac = new Factory(attrs => Key.create(attrs))
  .extend(KeyFac);
