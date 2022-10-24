import ClassToggler from "./ClassToggler"

interface DropdownOptions {
    openClassName?: string
    closedClassName?: string
    defaultOpen?: boolean
}

export default class Dropdown<E extends HTMLElement> {
    private _cToggler: ClassToggler<E>

    public onOpen?: () => void
    public onClose?: () => void
    public onToggle?: (isOpen: boolean) => void

    constructor(public readonly element: E, {openClassName, closedClassName, defaultOpen}: DropdownOptions) {
        this._cToggler = new ClassToggler(element, {
            activeClassName: openClassName, 
            disabledClassName: closedClassName,
            active: defaultOpen
        })
    }

    get isOpen() {
        return this._cToggler.isActive
    }

    setOpen(open: boolean) {
        this._cToggler.setClass(open)

        if (open === true) this.onOpen && this.onOpen()
        else this.onClose && this.onClose()
        this.onToggle && this.onToggle(open)

        return this
    }

    toggleOpen() {
        this.setOpen(!this.isOpen)
        return this
    }

    assignToggleButton(button: HTMLElement, callback?: (dropdown: Dropdown<E>) => void) {
        button.addEventListener("click", () => {
            this.toggleOpen()
            if (callback) callback(this)
        })
    }
}