import {arrayOf, Schema} from 'normalizr';
import i from 'icepick';
import uuid from 'node-uuid';

export const SINGLETON_ID = 'SINGLETON_ID';

const boardSchema = new Schema('Board');
const configSchema = new Schema('Config');
const djSchema = new Schema('Dj');
const keySchema = new Schema('Key');
const sessionSchema = new Schema('Session', {idAttribute: () => SINGLETON_ID});
const shortcutSchema = new Schema('Shortcut');
const shortcutCommandSchema = new Schema('ShortcutCommand');
const soundSchema = new Schema('Sound');
const audioBlobSchema = new Schema('AudioBlob', {idAttribute: uuid.v4()});

boardSchema.define({sounds: arrayOf(soundSchema), dj: djSchema});
configSchema.define({dj: djSchema, shortcuts: arrayOf(shortcutSchema)});
djSchema.define({config: configSchema, boards: arrayOf(boardSchema)});
keySchema.define({shortcuts: arrayOf(shortcutSchema)});
shortcutCommandSchema.define({shortcuts: arrayOf(shortcutSchema)});
shortcutSchema.define({
  key: keySchema,
  sound: soundSchema,
  config: configSchema
});
soundSchema.define({board: boardSchema, shortcut: shortcutSchema});

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
  SHORTCUT_COMMAND: shortcutCommandSchema,
  SHORTCUT_COMMAND_ARRAY: arrayOf(shortcutCommandSchema),
  KEY: keySchema,
  KEY_ARRAY: arrayOf(keySchema),
  AUDIO_BLOB: audioBlobSchema,
  AUDIO_BLOB_ARRAY: arrayOf(audioBlobSchema)
});
