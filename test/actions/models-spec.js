import expect from 'expect';

import { assignShortcutKeys } from 'app/actions';
import { ASSIGN_SHORTCUT_KEYS } from 'app/constants';

describe('Actions - models', () => {
  describe('#assignShortcutKeys', function() {
    it('returns properly-formed action', () => {
      const {type} = assignShortcutKeys();
      expect(type).toEqual(ASSIGN_SHORTCUT_KEYS);
    });
  });
});
