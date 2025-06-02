import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEventListeners, useListeners } from '../src/stimulus-listeners';

class DummyController {
  static listeners: Record<string, any>
  element: HTMLElement
  _managedListeners?: Array<any>
  
  onFoo = vi.fn()
  onBar = vi.fn()

  constructor() {
    this.element = document.createElement('div')
  }

  connect(): void {}
  disconnect(): void {}
}

function testResolveTarget(controller: Controller, target?: string | EventTarget | null): EventTarget {
  const testController = {
    ...controller,
    testMethod: vi.fn()
  };
  
  useEventListeners(testController, {
    test: {
      method: 'testMethod',
      target: target
    }
  });
  
  (testController as any).connect();
  
  const managedListeners = (testController as any)._managedListeners || [];
  const listener = managedListeners[0];
  
  return listener ? listener.target : controller.element;
}

describe('useEventListeners (explicit)', () => {
  let ctrl: DummyController & { connect: () => void; disconnect: () => void }

  beforeEach(() => {
    ctrl = new DummyController() as any
    useEventListeners(ctrl, { click: 'onFoo' })
    ctrl.connect = (ctrl as any).connect.bind(ctrl)
    ctrl.disconnect = (ctrl as any).disconnect.bind(ctrl)
    document.body.appendChild(ctrl.element)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.resetAllMocks()
  })

  it('wires and cleans up click listener', () => {
    ctrl.connect()
    ctrl.element.dispatchEvent(new MouseEvent('click'))
    expect(ctrl.onFoo).toHaveBeenCalledTimes(1)

    ctrl.disconnect()
    ctrl.element.dispatchEvent(new MouseEvent('click'))
    expect(ctrl.onFoo).toHaveBeenCalledTimes(1)
  })

  it('supports tuple config', () => {
    ctrl = new DummyController() as any
    useEventListeners(ctrl, { click: ['onBar', { once: true }] })
    ctrl.connect = (ctrl as any).connect.bind(ctrl)
    ctrl.disconnect = (ctrl as any).disconnect.bind(ctrl)
    document.body.appendChild(ctrl.element)

    ctrl.connect()
    ctrl.element.dispatchEvent(new MouseEvent('click'))
    ctrl.element.dispatchEvent(new MouseEvent('click'))
    expect(ctrl.onBar).toHaveBeenCalledOnce()
  })

  it('wires multiple events', () => {
    ctrl = new DummyController() as any
    useEventListeners(ctrl, { click: 'onFoo', mouseover: 'onBar' })
    ctrl.connect = (ctrl as any).connect.bind(ctrl)
    ctrl.disconnect = (ctrl as any).disconnect.bind(ctrl)
    document.body.appendChild(ctrl.element)

    ctrl.connect()
    ctrl.element.dispatchEvent(new MouseEvent('click'))
    ctrl.element.dispatchEvent(new MouseEvent('mouseover'))
    expect(ctrl.onFoo).toHaveBeenCalled()
    expect(ctrl.onBar).toHaveBeenCalled()
  })
  
  it('disconnect does not throw if no listeners were attached', () => {
    const ctrl = new DummyController() as any
    ctrl.connect = () => {}
    ctrl.disconnect = () => {}
    useEventListeners(ctrl, { click: 'nonExisting' })
    expect(() => ctrl.disconnect()).not.toThrow()
  })
})

describe('useListeners (static)', () => {
  let ctrl: DummyController & { connect: () => void; disconnect: () => void }

  beforeEach(() => {
    DummyController.listeners = { custom: 'onFoo' }
    ctrl = new DummyController() as any
    useListeners(ctrl)
    ctrl.connect = (ctrl as any).connect.bind(ctrl)
    ctrl.disconnect = (ctrl as any).disconnect.bind(ctrl)
    document.body.appendChild(ctrl.element)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.resetAllMocks()
  })

  it('wires static listeners', () => {
    ctrl.connect()
    ctrl.element.dispatchEvent(new Event('custom'))
    expect(ctrl.onFoo).toHaveBeenCalled()
  })

  it('removes static listeners on disconnect', () => {
    ctrl.connect()
    ctrl.disconnect()
    ctrl.element.dispatchEvent(new Event('custom'))
    expect(ctrl.onFoo).not.toHaveBeenCalled()
  })

  it('wires multiple static listeners', () => {
    DummyController.listeners = { custom: 'onFoo', another: 'onBar' }
    ctrl = new DummyController() as any
    useListeners(ctrl)
    ctrl.connect = (ctrl as any).connect.bind(ctrl)
    ctrl.disconnect = (ctrl as any).disconnect.bind(ctrl)
    document.body.appendChild(ctrl.element)

    ctrl.connect()
    ctrl.element.dispatchEvent(new Event('custom'))
    ctrl.element.dispatchEvent(new Event('another'))
    expect(ctrl.onFoo).toHaveBeenCalled()
    expect(ctrl.onBar).toHaveBeenCalled()
  })

  it('ignores invalid listeners argument', () => {
    ctrl = new DummyController() as any
    // @ts-expect-error: testing invalid argument
    expect(() => useEventListeners(ctrl, null)).not.toThrow()
  })
})

describe('resolveTarget', () => {
  let controller: Controller;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <button id="test-button">Test</button>
      <span class="test-span">Span</span>
    `;

    controller = {
      element: mockElement
    } as Controller;
  });

  it('returns controller.element when target is undefined', () => {
    const result = testResolveTarget(controller, undefined);
    expect(result).toBe(controller.element);
  });

  it('returns controller.element when target is null', () => {
    const result = testResolveTarget(controller, null);
    expect(result).toBe(controller.element);
  });

  it('returns the element matching a selector string', () => {
    const result = testResolveTarget(controller, '#test-button');
    expect(result).toBe(mockElement.querySelector('#test-button'));
  });

  it('throws error when selector does not match any element', () => {
    expect(() => {
      testResolveTarget(controller, '#non-existent');
    }).toThrow('No element matches selector "#non-existent"');
  });

  it('returns the provided EventTarget when target is already an EventTarget', () => {
    const targetElement = document.createElement('div');
    const result = testResolveTarget(controller, targetElement);
    expect(result).toBe(targetElement);
  });
});
