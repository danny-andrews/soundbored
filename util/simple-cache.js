export default function() {
  let cache = {};
  function get(key, value) {
    if(!cache[key]) {
      cache[key] = value;
    }

    return cache[key];
  }
  function clear() {
    cache = {};
  }

  return Object.freeze({get, clear});
}
