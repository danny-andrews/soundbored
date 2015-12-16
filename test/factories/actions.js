import { Factory } from 'rosie';

import { ApiOptsFac } from './';
import { CALL_API } from 'app/middleware/api';

export const ActionFac = new Factory()
  .attr('type', 'FAKE');

export const ApiActionFac = new Factory()
  .extend(ActionFac)
  .attr(CALL_API, ['CALL_API'], function(callApi) {
    return ApiOptsFac.build(callApi);
  });
