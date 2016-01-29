import { Factory } from 'rosie';

export const ShortcutFac = new Factory()
  .sequence('id')
  .sequence('keyId')
  .sequence('configId')
  .sequence('shortcutCommandId');
