# mebus-solid

Solid-js bindings for MeBus, a type-safe message bus for browsers.

## Installation

```bash
npm install mebus-solid
```

## Usage

```tsx
import { useMeBus } from 'mebus-solid';
import { z } from 'zod';

const messageSchema = {
  increase: z.object({
    number: z.number(),
  }),
}

const Display = () => {
  const [count, setCount] = createSignal(0);

  useMeBus(messageSchema, {
    increase: (payload) => setCount(count() + payload.number),
  });

  return <div>{count}</div>
}

const Button = () => {
  const sendEvent = useMeBus(messageSchema);

  return <button onClick={() => sendEvent('increase', { number: 1 })}>Increase</button>
}

const App = () => {
  return (
    <div>
      <Display />
      <Button />
    </div>
  );
}
```


