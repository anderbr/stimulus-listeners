import { Controller } from '@hotwired/stimulus';

type ListenerConfig =
  | string
  | [string, AddEventListenerOptions]
  | {
      method: string;
      options?: AddEventListenerOptions;
      target?: string | EventTarget;
    };
type ListenerMap = Record<string, ListenerConfig>;

function resolveTarget(controller: Controller, target?: string | EventTarget): EventTarget {
  if (!target) return controller.element;
  if (typeof target === 'string') {
    const el = controller.element.querySelector(target);
    if (!el) throw new Error(`No element matches selector "${target}"`);
    return el;
  }
  return target;
}

function wireListeners(controller: Controller, listeners: ListenerMap) {
  const originalConnect = controller.connect?.bind(controller);
  const originalDisconnect = controller.disconnect?.bind(controller);

  controller.connect = function () {
    originalConnect?.();
    (this as any)._managedListeners = [];

    Object.entries(listeners).forEach(([eventName, config]) => {
      let methodName: string;
      let options: AddEventListenerOptions | undefined;
      let target: EventTarget;

      if (typeof config === 'string') {
        methodName = config;
        options = undefined;
        target = this.element;
      } else if (Array.isArray(config)) {
        [methodName, options] = config;
        target = this.element;
      } else {
        methodName = config.method;
        options = config.options;
        target = resolveTarget(this, config.target);
      }

      const handler = (this as any)[methodName].bind(this);
      target.addEventListener(eventName, handler, options);
      (this as any)._managedListeners.push({ eventName, handler, options, target });
    });
  };

  controller.disconnect = function () {
    (this as any)._managedListeners?.forEach(
      ({ eventName, handler, options, target }: any) => {
        target.removeEventListener(eventName, handler, options);
      }
    );
    (this as any)._managedListeners = [];
    originalDisconnect?.();
  };
}

export function useListeners(controller: Controller) {
  const ctor = controller.constructor as any;
  const listeners: ListenerMap | undefined = ctor.listeners;
  if (listeners) wireListeners(controller, listeners);
}

export function useEventListeners(controller: Controller, listeners: ListenerMap) {
  wireListeners(controller, listeners);
}
