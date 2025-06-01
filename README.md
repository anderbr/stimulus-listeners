# Stimulus Listeners

A zero-build Stimulus plugin that lets you declaratively or imperatively wire up DOM event listeners:

- **Static** via `static listeners = { … }`
- **Imperative** via `useEventListeners(controller, map)`

Features:

- Auto-cleanup on `disconnect`
- Supports options (`capture`, `once`, `passive`) and custom targets
- Plain JavaScript & TypeScript compatible
- No decorators or extra tooling needed at runtime

## Installation

```bash
npm install @smnandre/stimulus-listeners
```

## Usage

### Static listeners

```typescript
import {Controller} from '@hotwired/stimulus';
import {useListeners} from '@smnandre/stimulus-listeners';

export default class MyController extends Controller {
  static listeners = {
    'click': 'onClick',
    'keydown': ['onKeydown', {once: true}],
    'scroll': {method: 'onScroll', passive: true, target: window}
  };

  initialize() {
    useListeners(this);
  }

  onClick(e: Event) { /* … */
  }

  onKeydown(e: KeyboardEvent) { /* … */
  }

  onScroll(e: Event) { /* … */
  }
}
```

### Imperative listeners

```typescript
import { Controller } from '@hotwired/stimulus';
import { useEventListeners } from '@smnandre/stimulus-listeners';

export default class LegacyController extends Controller {
  initialize() {
    useEventListeners(this, {
      'custom': 'onCustom',
      'resize': ['onResize', { passive: true }]
    });
  }

  onCustom(e: Event) { /* … */ }
  onResize(e: Event) { /* … */ }
}
```

## Testing

To run the test suite:

```bash
npm install
npm test
```

To generate a coverage report:

```bash
npm run test:coverage
```

## License

[`stimulus-listeners`](https://github.com/smnandre/nmsize) is released by [Simon André](https://github.com/smnandre) under the [MIT License](LICENSE).
