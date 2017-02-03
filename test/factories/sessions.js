import {Factory} from 'rosie';

import {Session} from 'app/models';

export const SessionFac = new Factory()
  .sequence('id')
  .sequence('token');

export const SessionModelFac = new Factory(attrs => Session.create(attrs))
  .extend(SessionFac);
