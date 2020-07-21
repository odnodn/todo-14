type EventHandler = (e: Event) => void

type EventListener = {
  el: HTMLElement | (Window & typeof globalThis)
  type: keyof HTMLElementEventMap
  handler: EventHandler
}

class EventCollector {
  eventListenersList: EventListener[] = null

  constructor() {
    this.eventListenersList = []
  }

  add = (
    el: HTMLElement | (Window & typeof globalThis),
    type: keyof HTMLElementEventMap,
    handler: EventHandler
  ) => {
    el.addEventListener(type, handler)

    this.eventListenersList.push({ el, type, handler })
  }

  addAutoClear = (
    el: HTMLElement | (Window & typeof globalThis),
    type: keyof HTMLElementEventMap,
    handler: EventHandler
  ) => {
    const callback = (e) => {
      handler(e)

      const idx = this.eventListenersList.findIndex((l) => {
        return l.el === el && l.type === type
      })

      if (idx < 0) return
      el.removeEventListener(type, this.eventListenersList[idx].handler)
      this.eventListenersList.splice(idx, 1)
      console.table(this.eventListenersList)
    }

    el.addEventListener(type, callback)

    this.eventListenersList.push({ el, type, handler: callback })
  }

  remove = (
    el: HTMLElement | (Window & typeof globalThis),
    type: keyof HTMLElementEventMap
  ) => {
    const idx = this.eventListenersList.findIndex((l) => {
      return l.el === el && l.type === type
    })

    if (idx < 0) return

    el.removeEventListener(type, this.eventListenersList[idx].handler)

    this.eventListenersList.splice(idx, 1)
  }
}

const eventCollector = new EventCollector()

export { eventCollector }
