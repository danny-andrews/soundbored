import { find } from 'lodash';
import infect from 'infect';

const querying = () => infect.get('Querying')();
let nullShortcut;

export function shortcutForKeyCode(code) {
  const keyWithCode =
    find(querying().getAll('key'), key => key.code === code) || {shortcuts: []};
  const shortcut = keyWithCode.shortcuts[0];
  if(!shortcut) {
    return nullShortcut;
  }

  return shortcut;
}
