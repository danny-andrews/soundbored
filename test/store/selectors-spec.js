import expect from 'expect';

import * as sels from 'app/store/selectors';
import schema from 'app/store/schema';
import * as facs from 'test/factories';
import 'test/support/custom-assertions';
import { SHORTCUT_ACTIONS } from 'app/constants';

describe('Store - selectors', function() {
  beforeEach(function() {
    this.state = schema.getDefaultState();
    this.session = schema.from(this.state);
  });

  describe('#session', function() {
    it('returns first session', function() {
      const session = facs.SessionModelFac.build({id: 1});
      const res = sels.session(this.session.getNextState());
      expect(res.equals(session)).toBe(true);
    });
  });

  describe('#soundPlayers', function() {
    beforeEach(function() {
      sels.soundPlayers.resetRecomputations();
    });

    it('returns an array of sound players (one for each sound)', function() {
      facs.SoundModelFac.build({id: 2, filename: 'sound2.mp3'}, {
        suppressWarning: true
      });
      facs.SoundModelFac.build({id: 5, filename: 'sound5.mp3'}, {
        suppressWarning: true
      });
      const {2: player2, 5: player5} =
        sels.soundPlayers(this.session.getNextState());
      expect(player2.filepath).toBe(sels.soundPath('sound2.mp3'));
      expect(player5.filepath).toBe(sels.soundPath('sound5.mp3'));
      expect(player2.setup).toExist();
      expect(player5.setup).toExist();
    });

    it('recalculates when a filename changes', function() {
      const sound = facs.SoundModelFac.build({filename: 'bam.mp3'}, {
        suppressWarning: true
      });
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();

      sound.set('filename', 'blahblah.mp3');
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();
    });

    it('does not recalculate when filename changes to equal value', function() {
      const sound = facs.SoundModelFac.build({filename: 'pow.mp3'}, {
        suppressWarning: true
      });
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();

      sound.set('filename', 'pow.mp3');
      expect({sel: sels.soundPlayers, session: this.session}).toNotRecompute();
    });

    it('does not recalculate when other property changes', function() {
      const sound = facs.SoundModelFac.build({}, {suppressWarning: true});
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();

      sound.set('displayName', 'pop');
      expect({sel: sels.soundPlayers, session: this.session}).toNotRecompute();
    });

    it('recacluates when sound is added', function() {
      facs.SoundModelFac.build({}, {suppressWarning: true});
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();

      facs.SoundModelFac.build({}, {suppressWarning: true});
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();
    });

    it('recacluates when sound is removed', function() {
      const sound = facs.SoundModelFac.build({}, {suppressWarning: true});
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();

      sound.delete();
      expect({sel: sels.soundPlayers, session: this.session}).toRecompute();
    });
  });

  describe('#killSoundsShortcutCommand', function() {
    it('returns the shortcutCommand with name=KILL_ALL_SOUNDS', function() {
      const shortcutCommand = facs.ShortcutCommandModelFac.build({
        name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS
      });
      const res = sels.killSoundsShortcutCommand(this.session.getNextState());
      expect(res.equals(shortcutCommand)).toBe(true);
    });
  });

  describe('#playSoundShortcutCommand', function() {
    it('returns the shortcutCommand with name=PLAY_SOUND', function() {
      const shortcutCommand = facs.ShortcutCommandModelFac.build({
        name: SHORTCUT_ACTIONS.PLAY_SOUND
      });
      const res = sels.playSoundShortcutCommand(this.session.getNextState());
      expect(res.equals(shortcutCommand)).toBe(true);
    });
  });

  describe('#killSoundsShortcut', function() {
    it('returns the shortcut to run KILL_ALL_SOUNDS', function() {
      const shortcut = facs.ShortcutModelFac.build({
        shortcutCommand: facs.ShortcutCommandModelFac.build({
          name: SHORTCUT_ACTIONS.KILL_ALL_SOUNDS
        })
      });
      const res = sels.killSoundsShortcut(this.session.getNextState());
      expect(res.equals(shortcut)).toBe(true);
    });
  });
});
