export function applyActionAndGetNextSession({schema, state, action}) {
  const nextState = schema.from(state, action).reduce();
  return schema.from(nextState);
}
