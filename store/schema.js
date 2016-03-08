import { Schema } from 'redux-orm';

import { Board, Config, DJ, Key, ShortcutCommand, Shortcut, Sound, Session }
  from 'app/models';

const schema = new Schema();
schema.register(
  Board, Config, DJ, Key, ShortcutCommand, Shortcut, Sound, Session
);

export default schema;
