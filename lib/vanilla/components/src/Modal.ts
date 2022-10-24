export default class ModalController {
    // baseClass = "modal"
    public readonly classNames: {
        visible?: string
        hidden?: string
    }

    public onOpen: () => void
    public onClose: () => void
    
    public readonly element: HTMLElement
    // private _template = createElement(
    //     "div",
    //     {class: this.baseClass}
    // )


    public readonly noBodyOverflowWhenVisible: boolean


    constructor(
        element: HTMLElement | string,
        {
            hidden = true,
            visibleClass = "visible" as string | undefined,
            hiddenClass = "hidden" as string | undefined,
            onOpen = () => undefined,
            onClose = () => undefined,
            noBodyOverflowWhenVisible = true
        } = {}
    ) {
        if (visibleClass === undefined && hiddenClass === undefined) {
            throw new Error("Modal visibleClass and hiddenClass can't be undefined at the same time.")
        }

        // Fetching the element
        this.element = typeof element === "string"
        ? document.querySelector(element)!
        : element

        if (this.element === null) {
            throw new Error(`Modal element couldn't be found with given query "${element}"`)
        }
        
        this.classNames = {
            visible: visibleClass,
            hidden: hiddenClass
        }

        // Meta
        this.noBodyOverflowWhenVisible = noBodyOverflowWhenVisible

        // Event handlers
        this.onOpen = onOpen
        this.onClose = onClose

        // Hidden / visible state
        this.setHidden(hidden)
    }

    // Getters & setters
    get isHidden () {
        return this.classNames.hidden !== undefined
        ? this.element.classList.contains(this.classNames.hidden)
        : !this.element.classList.contains(this.classNames.visible!)
    }

    // Utils
    setHidden = (hidden: boolean) => {
        if (hidden === this.isHidden) return 

        const oldClass = !hidden ? this.classNames.hidden : this.classNames.visible
        const newClass = hidden ? this.classNames.hidden : this.classNames.visible

        if (oldClass !== undefined) this.element.classList.remove(oldClass)
        if (newClass !== undefined) this.element.classList.add(newClass)

        this.element.dataset.hidden = hidden ? "true" : "false"

        if (hidden === true) this.onClose()
        else this.onOpen()

        if (this.noBodyOverflowWhenVisible) this._toggleBodyOverflow(hidden)
        
        return this
    }
    open() {return this.setHidden(false)}
    close() {return this.setHidden(true)}

    // static getById = (id: number) => MODAL_INSTANCES.get(id)
    // static deleteInstance = (id: number) => MODAL_INSTANCES.delete(id)

    // Content
    // setContent = (content: HTMLElement | string) => {
    //     if (typeof content === "string") {
    //         this.element.innerHTML = content
    //     } else {
    //         this.element.replaceChildren(content)
    //     }
    //     return this
    // }

    assignCloseButton(button: HTMLButtonElement) {
        button.addEventListener("click", () => {
            this.close()
        })

        return this
    }

    private _toggleBodyOverflow(overflow: boolean) {
        document.querySelector("body")!.style.overflow = overflow
        ? ""
        : "hidden !important"
        document.querySelector("body")!.style.overflow = overflow
        ? ""
        : "hidden"
   
        return this
    }

    // Parent
    // removeSelf = () => {
    //     this._container.removeChild(this.element)
    //     return this
    // }
    // static remove = (modal: Modal) => {
    //     modal.removeSelf()
    //     return modal
    // }
    // private addSelfToContainer = () => {
    //     this._container.appendChild(this.element)
    // }
}