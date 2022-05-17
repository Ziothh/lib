import { $, createElement } from "../DOM"

export default class NavbarController {
    public items: HTMLElement[]
    public classNames: {open: string, active: string, scrolled: string}
    public classList: DOMTokenList
    public hamburger!: HTMLDivElement

    /** The amount of pixels you have to scroll untill the scrollListener gets called. 
     * @default scrollListenerOffset = 1 // in px
    */
    public readonly scrollListenerOffset: number
    /** The amount of time (in ms) between the calls of the scrollListener 
     * @default scrollListenerDelay = 0 // in ms
    */
    public readonly scrollListenerDelay: number
    
    public readonly hamburgerContainer: HTMLElement
    
    private _isOpen: boolean
    private _hasScrolled: boolean
    #activeScrollListenerInstance!: (() => void) | null
    

    constructor(
        public navElement = $("nav")!,
        {
            useScrollListener = true,
            activeClassName = "active",
            openClassName = "open",
            scrolledClassName = "scrolled",
            scrollListenerOffset = 1,
            hamburgerContainer = navElement,
            autoInjectHamburger = true,
            scrollListenerDelay = 0,
        } = {}
    ) {
        // Element
        this.classList = navElement.classList

        // Data
        this.classNames = {
            active: activeClassName,
            open: openClassName,
            scrolled: scrolledClassName
        }
        this.scrollListenerOffset = scrollListenerOffset
        this.scrollListenerDelay = scrollListenerDelay
        this.items = Array.from(navElement.querySelectorAll("[data-role='nav-item']"))
        this.hamburgerContainer = hamburgerContainer
        
        // State
        this._isOpen = false
        this._hasScrolled = false

        // Layout
        if (autoInjectHamburger) this._injectHamburger()

        // Functionality
        if (useScrollListener) {
            this.onScroll()
            this.addScrollListener()
        }
        else this.#activeScrollListenerInstance = null
    }

    get isOpen() {
        return this._isOpen
    }
    setOpen (open: boolean) {
        this._isOpen = open
        this.setClassName(this.classNames.open, open)
        return this
    }

   
    private _injectHamburger () {
        const line = createElement("span", {class: "line"})

        this.hamburger = createElement(
            "div", 
            {id: "hamburger"},
            line.cloneNode() as HTMLSpanElement,
            line.cloneNode() as HTMLSpanElement,
            line.cloneNode() as HTMLSpanElement,
        )

        this.hamburgerContainer.appendChild(this.hamburger)

        document.addEventListener("click", ({target}) => {
            if (this.hamburger.contains(target as any)) {
                this.setOpen(!this._isOpen)
            } else {
                if (
                    this._isOpen 
                    && !this.navElement.contains(target as any)
                ) this.setOpen(false)
            }
        })

        window.addEventListener("resize", () => {
            if (
                this._isOpen 
                && window.getComputedStyle(this.hamburger)
                .display === "none"
            ) {
                this.setOpen(false)
            }
        })
    }

    // Helpers
    setClassName(className: string, active: boolean) {
        if (active) this.classList.add(className) 
        else this.classList.remove(className)

        return this
    }

    get scrolled() {
        return this._hasScrolled
    }
    private onScroll() {
        this.setClassName(
            this.classNames.scrolled, 
            (
                (document.documentElement?.scrollTop || document.body.scrollTop) 
                > this.scrollListenerOffset
            ) ? true : false
        )
    }

    addScrollListener(callback?: () => void) {
        if (this.#activeScrollListenerInstance !== null) this.removeScrollListener()

        this.#activeScrollListenerInstance = () => {
            requestAnimationFrame(() => {
                // Call the callbacks
                this.onScroll()
                callback?.()

                // Remove this listener
                this.removeScrollListener()

                // Wait for a certain time and add it back.
                setTimeout(() => {
                    this.addScrollListener(callback)
                }, this.scrollListenerDelay)
            })
        }

        document.addEventListener("scroll", this.#activeScrollListenerInstance)

        return this
    }
    removeScrollListener() {
        if (this.#activeScrollListenerInstance !== null) {
            document.removeEventListener("scroll", this.#activeScrollListenerInstance)
            this.#activeScrollListenerInstance = null
        }
        return this
    }
}

