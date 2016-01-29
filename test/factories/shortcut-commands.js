import assert from 'arg-assert';
import { Factory } from 'rosie';

import { SHORTCUT_ACTIONS } from 'app/constants';
import { values } from 'lodash';

export const ShortcutCommandFac = new Factory()
  .sequence('id')
  .attr('name', ['name'], name => {
    assert(
      values(SHORTCUT_ACTIONS).indexOf(name),
      'Invalid name value given ${name}'
    );
    return name;
  });
