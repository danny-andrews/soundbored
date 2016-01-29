import { Factory } from 'rosie';

const START_CODE = 65;

export const KeyFac = new Factory()
  .sequence('id')
  .sequence('code', i => `Key${String.fromCharCode(i + START_CODE - 1)}`);
