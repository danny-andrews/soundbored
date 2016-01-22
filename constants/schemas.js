import { Schema, arrayOf } from 'normalizr';
import uuid from 'node-uuid';
import i from 'icepick';

export const SINGLETON_ID = 'SINGLETON_ID';

const boardSchema = new Schema('boards');
const configSchema = new Schema('configs');
const djSchema = new Schema('djs');
const keySchema = new Schema('keys');
const sessionSchema = new Schema('sessions', {idAttribute: () => SINGLETON_ID});
const shortcutSchema = new Schema('shortcuts');
const soundSchema = new Schema('sounds');
const audioBlobSchema = new Schema('audioBlobs', {idAttribute: uuid.v4()});

boardSchema.define({sounds: arrayOf(soundSchema), dj: djSchema});
djSchema.define({config: configSchema, boards: arrayOf(boardSchema)});
keySchema.define({shortcuts: arrayOf(shortcutSchema)});
shortcutSchema.define({
  key: keySchema,
  sound: soundSchema,
  configs: arrayOf(configSchema)
});
soundSchema.define({board: boardSchema, shortcuts: arrayOf(shortcutSchema)});

export default i.freeze({
  SESSION: sessionSchema,
  CONFIG: configSchema,
  CONFIG_ARRAY: arrayOf(configSchema),
  DJ: djSchema,
  DJ_ARRAY: arrayOf(djSchema),
  BOARD: boardSchema,
  BOARD_ARRAY: arrayOf(boardSchema),
  SOUND: soundSchema,
  SOUND_ARRAY: arrayOf(soundSchema),
  SHORTCUT: shortcutSchema,
  SHORTCUT_ARRAY: arrayOf(shortcutSchema),
  KEY: keySchema,
  KEY_ARRAY: arrayOf(keySchema),
  AUDIO_BLOB: audioBlobSchema,
  AUDIO_BLOB_ARRAY: arrayOf(audioBlobSchema)
});
