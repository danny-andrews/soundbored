import {schema} from 'normalizr';
import i from 'icepick';
import uuid from 'node-uuid';

export const SINGLETON_ID = 'SINGLETON_ID';

const boardSchema = new schema.Entity('Board');
const configSchema = new schema.Entity('Config');
const djSchema = new schema.Entity('Dj');
const keySchema = new schema.Entity('Key');
const sessionSchema = new schema.Entity('Session', {}, {idAttribute: () => SINGLETON_ID});
const shortcutSchema = new schema.Entity('Shortcut');
const shortcutCommandSchema = new schema.Entity('ShortcutCommand');
const soundSchema = new schema.Entity('Sound');
const audioBlobSchema = new schema.Entity('AudioBlob', {}, {idAttribute: uuid.v4()});

boardSchema.define({sounds: [soundSchema], dj: djSchema});
configSchema.define({dj: djSchema, shortcuts: [shortcutSchema]});
djSchema.define({config: configSchema, boards: [boardSchema]});
keySchema.define({shortcuts: [shortcutSchema]});
shortcutCommandSchema.define({shortcuts: [shortcutSchema]});
shortcutSchema.define({
  key: keySchema,
  sound: soundSchema,
  config: configSchema
});
soundSchema.define({board: boardSchema, shortcut: shortcutSchema});

export default i.freeze({
  SESSION: sessionSchema,
  CONFIG: configSchema,
  CONFIG_ARRAY: [configSchema],
  DJ: djSchema,
  DJ_ARRAY: [djSchema],
  BOARD: boardSchema,
  BOARD_ARRAY: [boardSchema],
  SOUND: soundSchema,
  SOUND_ARRAY: [soundSchema],
  SHORTCUT: shortcutSchema,
  SHORTCUT_ARRAY: [shortcutSchema],
  SHORTCUT_COMMAND: shortcutCommandSchema,
  SHORTCUT_COMMAND_ARRAY: [shortcutCommandSchema],
  KEY: keySchema,
  KEY_ARRAY: [keySchema],
  AUDIO_BLOB: audioBlobSchema,
  AUDIO_BLOB_ARRAY: [audioBlobSchema]
});
