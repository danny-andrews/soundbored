import {merge} from 'icepick';
import {reduce} from 'lodash';

export function extractEntities(data) {
  const normalizedEntities = reduce(
    Array.isArray(data.data) ? data.data : [data.data],
    (acc, entity) => {
      const {id} = entity;
      const attributes = merge(entity.attributes, {id});
      acc[entity.type] = (acc[entity.type] || []).concat(attributes);

      return acc;
    },
    {}
  );

  return normalizedEntities;
}
