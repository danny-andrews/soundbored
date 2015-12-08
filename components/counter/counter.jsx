<p>
  Clicked: {context.counter} times
  {' '}
  <button onClick={context.increment}>+</button>
  {' '}
  <button onClick={context.decrement}>-</button>
  {' '}
  <button onClick={context.incrementIfOdd}>Increment if odd</button>
  {' '}
  <button onClick={() => context.incrementAsync()}>Increment async</button>
</p>
