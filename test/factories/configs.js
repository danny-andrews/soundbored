import { Factory } from 'rosie';

export const ConfigFac = new Factory()
  .sequence('id')
  .sequence('dj_id');
