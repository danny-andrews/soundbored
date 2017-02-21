import assert from 'arg-assert';
import i from 'icepick';

export default function(resources) {
  assert(
    Array.isArray(resources)
      && resources.length > 0
      && resources.every(resource => resource.hasOwnProperty('id')),
    '"resources" param must be an array with length > 0 of elements with an '
      + '"id" property'
  );

  let availableQueue = i.freeze(resources);
  let busyMap = i.freeze({});

  function hasFreeResource() {
    return availableQueue.length > 0;
  }
  function busy() {
    assert(hasFreeResource(), 'No available resources');
    const [lastEl] = availableQueue;
    busyMap = i.set(busyMap, lastEl.id, lastEl);
    availableQueue = i.shift(availableQueue);

    return lastEl;
  }
  function free(id) {
    const itemToFree = busyMap[id];
    assert(itemToFree, `Invalid value ${id} given for "id"`);
    busyMap = i.unset(busyMap, id);
    availableQueue = i.push(availableQueue, itemToFree);
  }

  return Object.freeze({busy, free, hasFreeResource});
}
