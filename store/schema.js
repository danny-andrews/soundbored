import { Schema } from 'redux-orm';

import { Board, Config, Dj, Key, ShortcutCommand, Shortcut, Sound, Session }
  from 'app/models';

const schema = new Schema();
schema.register(
  Board, Config, Dj, Key, ShortcutCommand, Shortcut, Sound, Session
);

export default schema;
