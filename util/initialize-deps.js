import infect from 'infect';

import { extractEntities } from 'app/util/json-api-helpers';

infect.set('ResponseDataTransformer', extractEntities);
