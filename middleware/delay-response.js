// Creates artificial delay for requests to external api
export default function(delay) {
  return () => next => action => {
    if(!action.response) {
      return next(action);
    }

    return setTimeout(() => next(action), delay);
  };
}
