import { createElement } from "@lib/helpers/elements"

interface ClassNameOptions {
    customOption?: string 
    customOptionList?: string
    open?: string
    selectedOption?: string
     
}

export default class CustomSelect {
    static componentName = "Select"

    public classNames: ClassNameOptions
    
    public readonly baseElements: {
        select: HTMLSelectElement,
        options: HTMLOptionElement[],
        placeholder: HTMLOptionElement | null
    }
    public readonly customElements: {
        optionList: HTMLUListElement,
        options: HTMLLIElement[],
        placeholder: HTMLLIElement | null
    }

    public readonly container: HTMLDivElement
    public readonly optionValues: string[]

    constructor(
        container: HTMLDivElement = document.querySelector(`[data-component="${CustomSelect.componentName}"]`)!, 
        classNames: ClassNameOptions = {}
    ) {
        this.classNames = {
            open: "open",
            ...classNames
        }

        this.container = container
        const selectElement = this.container.querySelector("select")!
        // selectElement.classList.add("sronly")
        
        
        this.baseElements = {
            select: selectElement,
            options: [],
            placeholder: null
        }
        this.optionValues = []

        this.customElements = {
            optionList: createElement("ul",  { class: this.classNames.customOptionList ?? "", }),
            options: [],
            placeholder: null
        }
        Array.from(selectElement.querySelectorAll("option")).forEach(o => {
            const customOption = createElement("li", 
                {
                    class: `${this.classNames.customOption} ${o.value === selectElement.value ? this.classNames.selectedOption ?? "" : ""}`,
                    dataset: {
                        value: o.value,
                    },
                    onClick: () => {
                        if (this.isOpen === true) {
                            this.setCurrentOption(o.value)
                            this.toggleOpen(false)
                        }
                    }
                }, 
                o.innerText
            )

            if (o.dataset.role === "placeholder") {
                this.baseElements.placeholder = o
                this.customElements.placeholder = customOption
            }
            else {
                this.optionValues.push(o.value)
                this.baseElements.options.push(o)
                this.customElements.options.push(customOption)
            }

            this.customElements.optionList.appendChild(customOption)
        })

        this.container.appendChild(this.customElements.optionList)

        // Hidden the selected value on init
        this.current.customElement.style.display = "none"


        // Event listeners
        selectElement.addEventListener("mousedown", (e) => {
            e.preventDefault()
        })
        selectElement.addEventListener("click", () => {
            this.toggleOpen()
        })
        this.baseElements.select.addEventListener("change", () => {
            this.setCurrentOption(this.baseElements.select.value)
        })
        document.addEventListener("click", e => {
            if (this.isOpen && !this.container.contains(e.target as any)) this.toggleOpen(false)
        })
    }

    private setCurrentOption(value: string) {
        const previous = this.current;
        const next = this.getByValue(value)

        if (previous.value === next.value) return

        if (this.isRequired && previous.value === this.baseElements.placeholder?.value) {
            // If required: remove the placeholder from the DOM
            this.customElements.optionList.removeChild(previous.customElement)
        } else {
            if (this.classNames.selectedOption !== undefined) previous.customElement.classList.remove(this.classNames.selectedOption)
        }

        this.baseElements.select.value = value
        if (this.classNames.selectedOption !== undefined) next.customElement.classList.add(this.classNames.selectedOption ?? "")

        // Hide and unhide selected custom option
        previous.customElement.style.display = ""
        next.customElement.style.display = "none"

        // Finally dispatch event for react
        // this.baseElements.select.dispatchEvent(new Event("changed-event"))
    }

    getByValue(value: string) {
        return {
            value: value,
            customElement: this.customElements.options.find(o => o.dataset.value === value) || this.customElements.placeholder!,
            baseHTMLElement: this.baseElements.options.find(o => o.value === value) || this.baseElements.placeholder!
        }
    }

    get isOpen() {
        return this.container.classList.contains(this.classNames.open!)
    }

    get isRequired() {
        return this.baseElements.select.required
    }

    get current() {
        const selectValue = this.baseElements.select.value
        return {
            ...this.getByValue(selectValue)
        }
     
    }

    toggleOpen(open: boolean = !this.isOpen) {
        this.container.classList[open ? "add" : "remove"](this.classNames.open!)
     } 
}