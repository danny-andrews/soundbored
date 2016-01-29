import { Factory } from 'rosie';

export const ShortcutFac = new Factory()
  .sequence('id')
  .sequence('key_id')
  .sequence('config_id')
  .sequence('shortcut_command_id');
