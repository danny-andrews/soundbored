import {Board, Config, Dj, Key, Session, Shortcut, ShortcutCommand, Sound}
from 'app/models';
import {Schema} from 'redux-orm';

const schema = new Schema();
schema.register(
  Board, Config, Dj, Key, ShortcutCommand, Shortcut, Sound, Session
);

export default schema;
