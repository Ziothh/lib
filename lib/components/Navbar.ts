import {DOM} from "@ziothh/vanilla"

export class NavbarController {
    items: HTMLElement[]
    classNames: {open: string, active: string, scrolled: string}
    navElement: HTMLElement
    classList: DOMTokenList
    scrollListenerOffset: number
    hamburger!: HTMLDivElement
    strictMode: boolean
    
    private _activeItem!: HTMLElement | null
    private _isOpen: boolean
    private _hasScrolled: boolean
    private _activeScrollListenerInstance!: (() => void) | null

    constructor(
        {
            useScrollListener = true,
            navElement = document.querySelector("nav")!,
            activeClassName = "active",
            openClassName = "open",
            scrolledClassName = "scrolled",
            scrollListenerOffset = 60,
            strictMode = false
        } = {}
    ) {
        // Element
        this.navElement = navElement
        this.classList = navElement.classList

        // Data
        this.classNames = {
            active: activeClassName,
            open: openClassName,
            scrolled: scrolledClassName
        }
        this.scrollListenerOffset = scrollListenerOffset
        this.items = Array.from(navElement.querySelectorAll("[data-role='nav-item']"))
        
        // State
        this._isOpen = false
        this._hasScrolled = false
        this.setActiveItem(this.getActiveItemByClass() ?? this.getActiveItemByHref())
        this.strictMode = strictMode

        // Layout
        this._injectHamburger()

        // Functionality
        if (useScrollListener) {
            this.onScroll()
            this.addScrollListener()
        }
        else this._activeScrollListenerInstance = null
    }

    get activeItem() {
        return this._activeItem
    }
    setActiveItem(item: HTMLElement | null) {
        // Old
        this._activeItem?.classList.remove(this.classNames.active)

        // New
        this._activeItem = item
        if (this._activeItem !== null) this._activeItem.classList.add(this.classNames.active)

        return this
    }

    get isOpen() {
        return this._isOpen
    }
    setOpen (open: boolean) {
        this._isOpen = open
        this.setClassName(this.classNames.open, open)
        return this
    }

   
    private _injectHamburger (container = this.navElement.querySelector('[data-role="hamburger-container"]')! ) {
        const line = DOM.createElement("span", {class: "line"})

        this.hamburger = DOM.createElement(
            "div", 
            {id: "hamburger"},
            line.cloneNode() as HTMLSpanElement,
            line.cloneNode() as HTMLSpanElement,
            line.cloneNode() as HTMLSpanElement,
        )

        container.appendChild(this.hamburger)

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

    getActiveItemByClass = () => this.items.find(
        i => i.classList.contains(this.classNames.active)
    )


    getActiveItemByHref() {
        const normaliseHref = (href: string) => {
            const removeTrailingSlash = (str: string) => str.endsWith("/")
                ? str.slice(0, str.length - 1)
                : str
            

            const [url, search] = href.split("?")
            const [baseUrl, id] = url.split("#")

            let normalised = removeTrailingSlash(baseUrl)
            if (id !== undefined) normalised += "#" + removeTrailingSlash(id)
            if (search !== undefined) normalised += "?" + removeTrailingSlash(search)

            return normalised
        }

        const normalisedWindowLocation = new URL(normaliseHref(window.location.href))

        const hrefToUrl = (href: string) => {
            return new URL(normaliseHref(
                href.startsWith("/") 
                ? `${normalisedWindowLocation.origin}${href}`
                : href
            ))
        }


        const hrefMap = new Map<HTMLElement, URL>()

        this.items.forEach(i => {
            const href = i.tagName.toLowerCase() === "a"
            ? (i as HTMLAnchorElement).href
            : i.querySelector("a")?.href

            if (href !== undefined) {
                hrefMap.set(i, hrefToUrl(href))
            }
        })

        const matches = this.items.reduce<HTMLElement[]>((acc, i) => {
            if (hrefMap.get(i)!.pathname === normalisedWindowLocation.pathname) {
                acc.push(i)
            }
            return acc
        }, [])

        // Not exact match
        if (matches.length === 0) {
            if (this.strictMode) throw Error("No nav item could be matched with the window url")
            else {
                let longestMatch: [null | HTMLElement, number] = [null, 0] ;

                hrefMap.forEach((url, el) => {
                    if (
                        normalisedWindowLocation.pathname.match(url.pathname) !== null 
                        && url.pathname.length > longestMatch[1]
                    ) longestMatch = [el, url.pathname.length]
                })

                return longestMatch[0]
            }
        }

        // Excact match of length 1
        else if (matches.length === 1) return matches[0]

        // Multiple exact matches
        else {
            // ID #
            const windowHash = normalisedWindowLocation.hash
            const hasHash = windowHash !== ""
            
            // Search ?
            const windowSearch = normalisedWindowLocation.search
            const hasSearch = windowSearch !== ""


            return this.items.find(i => {
                const href = hrefMap.get(i)!

                return (hasHash ? href.hash === windowHash : true) 
                && (hasSearch ? href.search === windowSearch : true)

            }) || null
        }
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

    addScrollListener(fn?: () => void) {
        if (this._activeScrollListenerInstance !== null) this.removeScrollListener()

        this._activeScrollListenerInstance = () => {
            this.onScroll()
            if (fn !== undefined) fn()
        }
        document.addEventListener("scroll", this._activeScrollListenerInstance)

        return this
    }
    removeScrollListener() {
        if (this._activeScrollListenerInstance !== null) {
            document.removeEventListener("scroll", this._activeScrollListenerInstance)
            this._activeScrollListenerInstance = null
        }
        return this
    }
}

