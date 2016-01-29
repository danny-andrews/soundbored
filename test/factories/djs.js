import { Factory } from 'rosie';

export const DjFac = new Factory()
  .sequence('id')
  .sequence('stage_name', i => `Kaskade${i}`);
