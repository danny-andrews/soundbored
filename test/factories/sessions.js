import { Factory } from 'rosie';

export const SessionFac = new Factory()
  .sequence('id')
  .sequence('token');
