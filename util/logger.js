export default (function() {
  const log = (...messages) => console.log(...messages);
  const warn = (...messages) => console.warn(...messages);
  const error = (...messages) => console.error(...messages);

  return Object.freeze({log, warn, error});
})();
