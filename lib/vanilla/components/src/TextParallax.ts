import { $, $$ } from "lib/vanilla/dist"
import EventListenerController from "./EventListenerController"

/** TODO: you can make this better by calculating the middle of the page container
 * (without navbar, ..., etc) instead of the middle of the viewport.
 */

/** */
export class TextParallaxController {
    public readonly intersectionObserver: IntersectionObserver
    private readonly scrollListener: EventListenerController<"scroll">
    private readonly resizeListener: EventListenerController<"resize">

    #isActive = true

    constructor(
        public readonly container: HTMLElement, 
        public readonly textElement: HTMLElement
    ) {
        const reWatch = () => {
            iObs.unobserve(this.container)
            iObs.observe(this.container)
        }

        const resizeListener = new EventListenerController("resize", () => {
            if (this.isActive) {
                this.transformText(this.calculateTextTranslation())
            }
        }, window)

        const eventListener = new EventListenerController("scroll", () => {
            eventListener.destroy()

            requestAnimationFrame(() => {
                reWatch()

                this.transformText(this.calculateTextTranslation())

                eventListener.mount()
            })

        }, window, {autoMount: false})

        

        const iObs = new IntersectionObserver(([parallaxContainerEntry]) => {
            const {isIntersecting} = parallaxContainerEntry

            if (!isIntersecting) {
                eventListener.destroy()
                this.setTextVisibility(false)
            } else {
                eventListener.mount()
                this.setTextVisibility(true)
            }
        })

        iObs.observe(container)

        // this.transformText(this.containerClientRect.height + "px")
        this.transformText(this.calculateTextTranslation())



        this.intersectionObserver = iObs
        this.scrollListener = eventListener
        this.resizeListener = resizeListener
    }

    transformText(amount: string | null) {
        this.textElement.style.transform = amount === null ? "" : `translateY(${amount})`
    }

    setTextVisibility(visible: boolean) {
        this.textElement.style.opacity = visible ? "" : "0"
    }

    get containerClientRect() {
        return this.container.getBoundingClientRect()
    } 

    get isActive() {
        return this.#isActive
    }

    deactivate() {
        if (this.#isActive === true) {
            this.intersectionObserver.unobserve(this.container)
            this.resizeListener.destroy()
            this.scrollListener.destroy()
            this.setTextVisibility(true)
            this.transformText(null)
            this.#isActive = false
        }
    }
    activate() {
        if (this.#isActive === false) {
            this.intersectionObserver.observe(this.container)
            this.resizeListener.mount()
            this.transformText(this.calculateTextTranslation())
            this.#isActive = true
        }
    }

    private calculateTextTranslation() {
        const {top, height, } = this.containerClientRect

        const windowHeight = window.innerHeight
        const containerMiddlePos = top + (height / 2)
        const windowMiddlePos = windowHeight / 2

        return `${containerMiddlePos - windowMiddlePos}px`
    }
}

export const mountParallax = (
        containerQuery = "[data-parallax-container]", 
        textElementQuery = "[data-parallax-text]"
) =>  $$(containerQuery).map(
    c => new TextParallaxController(c, $(textElementQuery, c)!)
)