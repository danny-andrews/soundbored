import { Factory } from 'rosie';

export const DjFac = new Factory()
  .sequence('id')
  .sequence('stageName', i => `Kaskade${i}`);
