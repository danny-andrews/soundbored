import {Config} from 'app/models';
import {DjModelFac} from './djs';
import {Factory} from 'rosie';

export const ConfigFac = new Factory()
  .sequence('id')
  .sequence('dj_id');

export const ConfigModelFac = new Factory(attrs => Config.create(attrs))
  .extend(ConfigFac)
  .attr('dj', ['id', 'dj'], (id, dj) =>
    (dj ? dj : DjModelFac.build({config: id})));
