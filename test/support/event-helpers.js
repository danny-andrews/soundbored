export function simulateKeyboardEvent({type, el}, addlData) {
  const e = new Event(type);
  Object.keys(addlData).forEach(key => {
    e[key] = addlData[key];
  });
  el.dispatchEvent(e);
}
