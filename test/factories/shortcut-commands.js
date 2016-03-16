import assert from 'arg-assert';
import { Factory } from 'rosie';
import { values } from 'lodash';

import { ShortcutCommand } from 'app/models';
import { SHORTCUT_ACTIONS } from 'app/constants';

export const ShortcutCommandFac = new Factory()
  .sequence('id')
  .attr('name', ['name'], name => {
    assert(
      values(SHORTCUT_ACTIONS).indexOf(name),
      'Invalid name value given ${name}'
    );
    return name;
  });

export const ShortcutCommandModelFac =
  new Factory(attrs => ShortcutCommand.create(attrs))
    .extend(ShortcutCommandFac);
