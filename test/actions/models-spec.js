import {ASSIGN_SHORTCUT_KEYS} from 'app/constants';
import {assignShortcutKeys} from 'app/actions';
import expect from 'expect';

describe('Actions - models', () => {
  describe('#assignShortcutKeys', function() {
    it('returns properly-formed action', () => {
      const {type} = assignShortcutKeys();
      expect(type).toEqual(ASSIGN_SHORTCUT_KEYS);
    });
  });
});
