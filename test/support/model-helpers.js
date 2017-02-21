export function applyActionAndGetNextSession(opts) {
  const {schema, state, action: action = {}} = opts;
  const nextState = schema.from(state, action).reduce();

  return schema.from(nextState);
}
