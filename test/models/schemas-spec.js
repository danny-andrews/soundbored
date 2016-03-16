import expect from 'expect';
import { normalize } from 'normalizr';

import schemas, { SINGLETON_ID } from 'app/constants/schemas';

describe('Models - schemas', function() {
  describe('board', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 3,
        dj: {id: 12, name: 'Kaskade'},
        sounds: [{id: 92, name: 'beep'}, {id: 71, name: 'boop'}]
      }, schemas.BOARD).entities;
    });

    it('uses "id" as id', function() {
      expect(3 in this.subject.Board).toBe(true);
    });

    it('has "dj" association', function() {
      expect(this.subject.Dj[12].name).toBe('Kaskade');
    });

    it('has "sounds" association', function() {
      expect(this.subject.Sound[92].name).toBe('beep');
      expect(this.subject.Sound[71].name).toBe('boop');
    });
  });

  describe('config', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 26,
        dj: {id: 38, name: 'Bob'},
        shortcuts: [{id: 354, name: 'pow'}, {id: 38, name: 'bam'}]
      }, schemas.CONFIG).entities;
    });

    it('uses "id" as id', function() {
      expect(26 in this.subject.Config).toBe(true);
    });

    it('has "dj" association', function() {
      expect(this.subject.Dj[38].name).toBe('Bob');
    });

    it('has "shortcuts" association', function() {
      expect(this.subject.Shortcut[354].name).toBe('pow');
      expect(this.subject.Shortcut[38].name).toBe('bam');
    });
  });

  describe('dj', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 3,
        config: {id: 1, configVal1: 'configVal1'},
        boards: [{id: 1, name: 'board1'}, {id: 2, name: 'board2'}]
      }, schemas.DJ).entities;
    });

    it('uses "id" as id', function() {
      expect(3 in this.subject.Dj).toBe(true);
    });

    it('has "config" association', function() {
      expect(this.subject.Config[1].configVal1).toBe('configVal1');
    });

    it('has "boards" association', function() {
      expect(this.subject.Board[1].name).toBe('board1');
      expect(this.subject.Board[2].name).toBe('board2');
    });
  });

  describe('key', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 52,
        shortcuts: [{id: 2}, {id: 5}]
      }, schemas.KEY).entities;
    });

    it('uses "id" as id', function() {
      expect(52 in this.subject.Key).toBe(true);
    });

    it('has "shortucts" association', function() {
      expect(2 in this.subject.Shortcut).toBe(true);
      expect(5 in this.subject.Shortcut).toBe(true);
    });
  });

  describe('session', function() {
    beforeEach(function() {
      this.subject = normalize({}, schemas.SESSION).entities;
    });

    it('uses "SINGLETON_ID" as id', function() {
      expect(SINGLETON_ID in this.subject.Session).toBe(true);
    });
  });

  describe('shortcutCommand', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 32,
        shortcuts: [{id: 63, name: 'do this'}, {id: 732, name: 'do that'}]
      }, schemas.SHORTCUT_COMMAND).entities;
    });

    it('uses "id" as id', function() {
      expect(32 in this.subject.ShortcutCommand).toBe(true);
    });

    it('has "shortcuts" association', function() {
      expect(this.subject.Shortcut[63].name).toBe('do this');
      expect(this.subject.Shortcut[732].name).toBe('do that');
    });
  });

  describe('shortcut', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 52,
        key: {id: 437},
        sound: {id: 2084},
        config: {id: 16}
      }, schemas.SHORTCUT).entities;
    });

    it('uses "id" as id', function() {
      expect(52 in this.subject.Shortcut).toBe(true);
    });

    it('has "key" association', function() {
      expect(437 in this.subject.Key).toBe(true);
    });

    it('has "sound" association', function() {
      expect(2084 in this.subject.Sound).toBe(true);
    });

    it('has "config" association', function() {
      expect(16 in this.subject.Config).toBe(true);
    });
  });

  describe('sound', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 320,
        board: {id: 17},
        shortcut: {id: 327}
      }, schemas.SOUND).entities;
    });

    it('uses "id" as id', function() {
      expect(320 in this.subject.Sound).toBe(true);
    });

    it('has "board" association', function() {
      expect(17 in this.subject.Board).toBe(true);
    });

    it('has "shortcut" association', function() {
      expect(327 in this.subject.Shortcut).toBe(true);
    });
  });

  describe('audioBlob', function() {
    beforeEach(function() {
      this.subject = normalize({id: 12}, schemas.AUDIO_BLOB).entities;
    });

    it('generates random id', function() {
      expect(Object.keys(this.subject.AudioBlob)[0]).toNotBe(12);
    });
  });
});
