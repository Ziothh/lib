import { $, $$, EventListenerController } from '@ziothh/vanilla'

interface IHoverZoomControllerOptions {
    scale: number
}

interface EventControllerMap {
    start: EventListenerController<any>
    move: EventListenerController<any>
    stop: EventListenerController<any>
}

export default class HoverZoomController {
    // @ts-ignore
    static MODE: "MOBILE" | "DESKTOP" = ((navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) ? "MOBILE" : "DESKTOP"

    public element: HTMLElement
    // #isHovering: boolean = false
    public readonly options: IHoverZoomControllerOptions
    #defaultOptions: IHoverZoomControllerOptions = {
        scale: 3
    }

    #eventControllers: {
        MOBILE: EventControllerMap
        DESKTOP: EventControllerMap
    }


    currentEventControllers: EventControllerMap

    constructor(element: HTMLElement | string, options: Partial<IHoverZoomControllerOptions> = {}) {
        this.options = {
            ...this.#defaultOptions,
            ...options,
        }

        this.element = typeof element === "string" ? $(element)! : element
        
        if (!element) throw Error(`No element could be found${typeof element === "string" ? ` with query ${element}.` : "."}`)

        this.#eventControllers = {
            DESKTOP: {
                start: new EventListenerController("mouseover", () => {
                    this.#eventControllers.DESKTOP.move.mount()
                    this.element.style.transform = `scale(${this.options.scale})`
                }, this.element, {
                    autoMount: false,
                    once: false,
                }),
                stop: new EventListenerController("mouseleave", () => {
                    this.#eventControllers.DESKTOP.move.destroy()
                    this.element.style.transform = ""
                }, this.element, {
                    autoMount: false,
                    once: false,
                }),
                move: new EventListenerController("mousemove", (e) => {
                    const clientRect = this.element.getBoundingClientRect()
                    this.element.style.transformOrigin = `${((e.offsetX * this.options.scale) / clientRect.width) * 100}% ${((e.offsetY * this.options.scale) / clientRect.height) * 100}%`
                }, this.element, {
                    autoMount: false,
                    once: false,
                })
            },
            MOBILE: {
                start: new EventListenerController("touchstart", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.#eventControllers.MOBILE.move.mount()
                    this.element.style.transform = `scale(${this.options.scale})`
                }, this.element, {
                    autoMount: false,
                    once: false,
                }),
                stop: new EventListenerController("touchend", () => {
                    this.#eventControllers.MOBILE.move.destroy()
                    this.element.style.transform = ""
                }, this.element, {
                    autoMount: false,
                    once: false,
                }),
                move: new EventListenerController("touchmove", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // console.log(e.targetTouches[0])
                    const touch = e.touches[0]!
                    const clientRect = this.element.parentElement!.getBoundingClientRect()

                    // const diff = (prefix: string, one, two, reference) => console.log(prefix, one, two, one - two, `${((one - two) / reference) * 100}%`)

                    // diff("X: ", touch.clientX, clientRect.x, clientRect.width)
                    // diff("Y: ", touch.clientY, clientRect.y, clientRect.height)

                    const calculate = (devicePos: number, elementPos: number, length: number) => {
                        const value = ((devicePos - elementPos) / length) * 100

                        return Math.max(Math.min(100, value), 0)
                    }

                    this.element.style.transformOrigin = `${calculate(touch.clientX, clientRect.x, clientRect.width)}% ${calculate(touch.clientY, clientRect.y, clientRect.height)}%` 
                    // console.log(`${(touch.screenX - clientRect.x) * 100}% ${(touch.screenY / clientRect.y) * 100}%`) 
                }, this.element, {
                    autoMount: false,
                    once: false,
                })
            }
        }


        this.currentEventControllers = this.#eventControllers[HoverZoomController.MODE]
        // new EventListenerController("touchmove", (ev) => {
        //     // this.eventControllers.mouseMove.mount()
        //     console.log(ev.touches)
        //     alert("touch")
        //     // this.element.style.transform = `scale(${this.options.scale})`
        // }, this.element, {
        //     autoMount: true,
        //     once: false,
        // })


        // this.element.addEventListener("touchmove", e => {
        //     console.log(e.targetTouches[0])
        // })


        this.mount()
    }

    getCurrentEventControllers() {
        return this.#eventControllers[HoverZoomController.MODE]
    }

    mount() {

        this.currentEventControllers.start.mount()
        this.currentEventControllers.stop.mount()
        this.element.style.cursor = "zoom-in"
    }
    
    unmount() {
        this.currentEventControllers.start.destroy()
        this.currentEventControllers.move.destroy()
        this.currentEventControllers.stop.destroy()
        this.element.style.cursor = ""
    }
}


// $$("img").forEach(img => new ImageZoomController(img))