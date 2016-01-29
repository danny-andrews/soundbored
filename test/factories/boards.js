import { Factory } from 'rosie';

export const BoardFac = new Factory()
  .sequence('id')
  .sequence('djId')
  .sequence('name', i => `Board${i}`);
