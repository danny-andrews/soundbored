import { reduce } from 'lodash';
import { merge } from 'icepick';

export function extractEntities(data) {
  const normalizedEntities = reduce(
    (Array.isArray(data.data) ? data.data : [data.data]),
    (acc, entity) => {
      const id = entity.id;
      const attributes = merge(entity.attributes, {id});
      acc[entity.type] = (acc[entity.type] || []).concat(attributes);
      return acc;
    },
    {}
  );

  return normalizedEntities;
}
