import {extractEntities} from 'app/util/json-api-helpers';
import infect from 'infect';

infect.set('ResponseDataTransformer', extractEntities);
