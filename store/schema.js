import { Schema } from 'redux-orm';

import { Board, Config, DJ, Key, ShortcutCommand, Shortcut, Sound }
  from 'app/models';

const schema = new Schema();
schema.register(Board, Config, DJ, Key, ShortcutCommand, Shortcut, Sound);

export default schema;
