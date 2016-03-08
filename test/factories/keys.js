import { Factory } from 'rosie';

import { Key } from 'app/models';

const START_CODE = 65;

const factory = attrs => {
  if(attrs.modelize) {
    return new Key(attrs);
  }
  else {
    return attrs;
  }
};

export const KeyFac = new Factory(factory)
  .sequence('id')
  .sequence('code', i => `Key${String.fromCharCode(i + START_CODE - 1)}`);
