// General Middleware Functions
const logger = store => next => (action) => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = store => next => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.log('Caught an exception!', err);
    console.log(store.getState());
    throw err;
  }
};

export {
  logger,
  crashReporter,
};
