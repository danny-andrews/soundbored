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
      expect(3 in this.subject.boards).toBe(true);
    });

    it('has "dj" association', function() {
      expect(this.subject.djs[12].name).toBe('Kaskade');
    });

    it('has "sounds" association', function() {
      expect(this.subject.sounds[92].name).toBe('beep');
      expect(this.subject.sounds[71].name).toBe('boop');
    });
  });

  describe('config', function() {
    beforeEach(function() {
      this.subject = normalize({id: 26}, schemas.CONFIG).entities;
    });

    it('uses "id" as id', function() {
      expect(26 in this.subject.configs).toBe(true);
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

    it('maintins id', function() {
      expect(3 in this.subject.djs).toBe(true);
    });

    it('has "config" association', function() {
      expect(this.subject.configs[1].configVal1).toBe('configVal1');
    });

    it('has "boards" association', function() {
      expect(this.subject.boards[1].name).toBe('board1');
      expect(this.subject.boards[2].name).toBe('board2');
    });
  });

  describe('key', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 52,
        shortcuts: [{id: 2}, {id: 5}]
      }, schemas.KEY).entities;
    });

    it('maintins id', function() {
      expect(52 in this.subject.keys).toBe(true);
    });

    it('has "boards" association', function() {
      expect(2 in this.subject.shortcuts).toBe(true);
      expect(5 in this.subject.shortcuts).toBe(true);
    });
  });

  describe('session', function() {
    beforeEach(function() {
      this.subject = normalize({}, schemas.SESSION).entities;
    });

    it('uses "SINGLETON_ID" as id', function() {
      expect(SINGLETON_ID in this.subject.sessions).toBe(true);
    });
  });

  describe('shortcut', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 52,
        key: {id: 437},
        sound: {id: 2084},
        configs: [{id: 16}, {id: 52}]
      }, schemas.SHORTCUT).entities;
    });

    it('maintins id', function() {
      expect(52 in this.subject.shortcuts).toBe(true);
    });

    it('has "key" association', function() {
      expect(437 in this.subject.keys).toBe(true);
    });

    it('has "sound" association', function() {
      expect(2084 in this.subject.sounds).toBe(true);
    });

    it('has "configs" association', function() {
      expect(16 in this.subject.configs).toBe(true);
      expect(52 in this.subject.configs).toBe(true);
    });
  });

  describe('sound', function() {
    beforeEach(function() {
      this.subject = normalize({
        id: 320,
        board: {id: 17},
        shortcuts: [{id: 2}, {id: 39}]
      }, schemas.SOUND).entities;
    });

    it('maintins id', function() {
      expect(320 in this.subject.sounds).toBe(true);
    });

    it('has "board" association', function() {
      expect(17 in this.subject.boards).toBe(true);
    });

    it('has "shortcuts" association', function() {
      expect(2 in this.subject.shortcuts).toBe(true);
      expect(39 in this.subject.shortcuts).toBe(true);
    });
  });

  describe('audioBlob', function() {
    beforeEach(function() {
      this.subject = normalize({id: 12}, schemas.AUDIO_BLOB).entities;
    });

    it('generates random id', function() {
      expect(Object.keys(this.subject.audioBlobs)[0]).toNotBe(12);
    });
  });
});
