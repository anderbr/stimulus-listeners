import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEventListeners, useListeners } from '../src/stimulus-listeners'

class DummyController {
  static listeners: Record<string, any>
  element: HTMLElement
  _managedListeners?: Array<any>
  
  onFoo = vi.fn()
  onBar = vi.fn()

  constructor() {
    this.element = document.createElement('div')
  }
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
})
