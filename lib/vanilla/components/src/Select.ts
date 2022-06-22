import { createElement } from "../DOM"

export default class SelectController {
    static componentName = "select"

    public classNames = {
        open: "select-input-container--open", // container
        selected: "custom-select-option--selected" // option
    }
    public readonly dataRoles = {
        placeholder: "placeholder"
    }
    
    public readonly baseElements: {
        select: HTMLSelectElement,
        options: HTMLOptionElement[],
        placeholder: HTMLOptionElement | null
    }
    public readonly customElements: {
        select: HTMLDivElement,
        options: HTMLDivElement[],
        placeholder: HTMLDivElement | null
    }

    public readonly container: HTMLDivElement
    public readonly optionValues: string[]

    public isOpen: boolean

    constructor(container: HTMLDivElement = document.querySelector(`[data-component="${SelectController.componentName}"]`)!) {
        this.container = container
        const selectElement = this.container.querySelector("select")!
        selectElement.classList.add("sronly")
        
        this.container = selectElement.parentElement! as HTMLDivElement
        
        this.isOpen = false
        this.baseElements = {
            select: selectElement,
            options: [],
            placeholder: null
        }
        this.optionValues = []

        this.customElements = {
            select: createElement("div",  { class: `custom-select-container`, }),
            options: [],
            placeholder: null
        }
        Array.from(selectElement.querySelectorAll("option")).forEach(o => {
            const customOption = createElement("div", 
                {
                    class: `custom-select-option ${o.value === selectElement.value ? this.classNames.selected : ""}`,
                    dataset: {
                        value: o.value,
                    },
                    onClick: () => {
                        const value = o.value
                        this.setCurrentOption(value)
                        this.baseElements.select.value = value
                        this.toggleOpen()
                    }
                }, 
                createElement("p", null, o.innerText)
            )

            // @ts-ignore
            if (o.dataset.role === "placeholder") {
                this.baseElements.placeholder = o
                this.customElements.placeholder = customOption
                // this.customElements.placeholder = createElement()
            }
            else {
                this.optionValues.push(o.value)
                this.baseElements.options.push(o)
                this.customElements.options.push(customOption)
            }

            this.customElements.select.appendChild(customOption)
        })

        this.container.appendChild(this.customElements.select)

        this.baseElements.select.addEventListener("change", () => {
            this.setCurrentOption(this.baseElements.select.value)
        })

        document.addEventListener("click", e => {
            if (!this.customElements.select.contains(e.target as any) && this.isOpen) this.toggleOpen(false)
        })
    }

    private setCurrentOption(value: string) {
        const previous = this.current;
        const next = this.getByValue(value)

        if (previous.value === next.value) return
        
        if (this.baseElements.select.required && previous.value === this.baseElements.placeholder?.value) {
            // If required: remove the placeholder from the DOM
            this.customElements.select.removeChild(previous.customElement)
        } else {
            this.current.customElement.classList.remove(this.classNames.selected)
        }

        this.baseElements.select.value = value
        next.customElement.classList.add(this.classNames.selected)

        // Finally dispatch event for react
        this.baseElements.select.dispatchEvent(new Event("changed-event"))
    }

    getByValue(value: string) {
        return {
            value: value,
            customElement: this.customElements.options.find(o => o.dataset.value === value) || this.customElements.placeholder!,
            baseHTMLElement: this.baseElements.options.find(o => o.value === value) || this.baseElements.placeholder!
        }
    }

    get current() {
        const selectValue = this.baseElements.select.value
        return {
            ...this.getByValue(selectValue)
        }
     
    }

    toggleOpen(value: boolean = !this.isOpen) {
        this.isOpen = value
        this.container.classList[value ? "add" : "remove"](this.classNames.open)
        console.log(this.customElements.select.className)
        // this.cus
    } 
}