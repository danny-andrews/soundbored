import { Factory } from 'rosie';

import { Shortcut } from 'app/models';

import { ConfigModelFac } from './configs';
import { KeyModelFac } from './keys';
import { ShortcutCommandModelFac } from './shortcut-commands';

export const ShortcutFac = new Factory()
  .sequence('id')
  .sequence('keyId')
  .sequence('configId')
  .sequence('shortcutCommandId');

export const ShortcutModelFac = new Factory(attrs => Shortcut.create(attrs))
  .extend(ShortcutFac)
  .attr('config', ['id', 'config'], (id, config) =>
    config ? config : ConfigModelFac.build({config: id}))
  .attr('key', ['id', 'key'], (id, key) =>
    key ? key : KeyModelFac.build({key: id}))
  .attr('shortcutCommand', ['id', 'shortcutCommand'], (id, shortcutCommand) =>
    shortcutCommand ? shortcutCommand : ShortcutCommandModelFac.build({
      shortcutCommand: id
    }));
