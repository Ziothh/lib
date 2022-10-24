interface ClassTogglerOptions {
    activeClassName?: string
    disabledClassName?: string
    active?: boolean
}

export default class ClassToggler<E extends HTMLElement> {
    public readonly activeClassName?: string
    public readonly disabledClassName?: string

    constructor(
        public readonly element: E, 
        {activeClassName, disabledClassName, active}: ClassTogglerOptions
    ) {
        this.activeClassName = activeClassName
        this.disabledClassName = disabledClassName
        if (active !== undefined) this.setClass(active)
    }

    get isActive() {
        return this.activeClassName !== undefined
        ? this.element.classList.contains(this.activeClassName)
        : !this.element.classList.contains(this.disabledClassName!)
    }

    setClass(active: boolean) {
        if (this.activeClassName !== undefined) {
            this.element.classList[active ? "add" : "remove"](this.activeClassName)
        }
        if (this.disabledClassName !== undefined) {
            this.element.classList[!active ? "add" : "remove"](this.disabledClassName)
        }

        return this
    }

    toggleClass() {
        this.setClass(!this.isActive)

        return this
    }
}