import {ConfigModelFac} from './configs';
import {Dj} from 'app/models';
import {Factory} from 'rosie';

export const DjFac = new Factory()
  .sequence('id')
  .sequence('stageName', i => `Kaskade${i}`);

export const DjModelFac = new Factory(attrs => Dj.create(attrs))
  .extend(DjFac)
  .attr('config', ['id', 'config'], (id, config) =>
    (config ? config : ConfigModelFac.build({config: id})));
