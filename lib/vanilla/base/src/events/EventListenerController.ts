import type { EventMap } from "./types"

export namespace N_EventListenerController {
    export interface Options {
        autoMount?: boolean
        once?: boolean
    }

    export type Callback<E extends keyof EventMap> = (e: EventMap[E], eventListenerController: EventListenerController<E>) => void
}


export default class EventListenerController<E extends keyof EventMap> {
    #wrappedCallback: (e: EventMap[E]) => void
    public readonly once: boolean

    #isActive: boolean = false

    constructor(
        public readonly event: E, 
        public readonly callback: N_EventListenerController.Callback<E>,
        public readonly element: Window | Document | HTMLElement = document,
        {
            autoMount = true,
            once = false
        }: N_EventListenerController.Options = {}
    ) {
        this.#wrappedCallback = (e) => callback(e, this)

        this.once = once

        if (autoMount === true) this.mount()
    }

    get isActive() {
        return this.#isActive
    }

    mount() {
        if (this.#isActive === false) {
            this.element.addEventListener(this.event, this.#wrappedCallback as any, {once: this.once})
            this.#isActive = true
        }
        return this
    }
    destroy() {
        if (this.#isActive === true) {
            this.element.removeEventListener(this.event, this.#wrappedCallback as any)
            this.#isActive = false
        }
        return this
    }
}