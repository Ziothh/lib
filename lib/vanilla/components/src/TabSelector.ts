import {createElement} from "../DOM"

export default class TabSelectorController {
    static componentName = "TabSelector"

    readonly baseElements: {
        select: HTMLSelectElement,
        options: HTMLOptionElement[]
    }
    readonly customElements: {
        select: HTMLDivElement,
        options: HTMLDivElement[]
    }
    readonly elementsMap: {[key: string]: {
        baseElement: HTMLOptionElement,
        customElement: HTMLDivElement,
        tabElement: HTMLElement
    }}
    
    readonly options: string[]

    readonly activeClass: string
    readonly customOptionClass = `${TabSelectorController.componentName}-custom-select-option`

    constructor(
        readonly container: HTMLElement = document.querySelector<HTMLDivElement>(`[data-component="${TabSelectorController.componentName}"]`)!,
        {
            activeClass = `${TabSelectorController.componentName}--active`
        } = {}
    ) {
        // Options
        this.activeClass = activeClass

        // Elements
        const HTMLSelect = container.querySelector("select")!
        this.baseElements = {
            select: HTMLSelect,
            options: [...HTMLSelect.querySelectorAll("option")!]
        }

        // Creating the custom elements
        this.customElements = {
            select: this.createCustomSelect(),
            options: []
        }        

        // Mapping all elements to the option values
        this.elementsMap = {}
        const optionsStringValues: string[] = []

        this.baseElements.options.forEach(o => {
            const optionStringValue = o.value

            optionsStringValues.push(optionStringValue)

            const co = createElement(
                "div",
                {
                    class: `${this.customOptionClass}`,
                    dataset: {
                        tabId: optionStringValue
                    },
                },
                o.innerText
            )

            co.addEventListener("click", () => {
                this.setActiveOption(o.value)
            })

            this.elementsMap[optionStringValue] = {
                baseElement: o,
                customElement: co,
                tabElement: document.querySelector(`[data-tab-id="${optionStringValue}"]`)!
            }

            this.customElements.options.push(co)
            this.customElements.select.append(co)
        })

        // Mapping all option string values
        this.options = optionsStringValues

        // Finally injecting into the dom
        this.baseElements.select.parentElement!.appendChild(this.customElements.select)

        this.updateVisualState()
    }

    isValidOption(optionValue: string) {
        return this.options.find(o => o === optionValue) !== undefined
    }

    private raiseOptionValueError(optionValue: string) {
        throw Error(`The option ${optionValue} is not a valid option. Valid options are: [${this.options.join(", ")}]`)
    }
  

    getOptionElementByValue (optionValue: string) {
        if (this.options && !this.isValidOption(optionValue)) this.raiseOptionValueError(optionValue)

        return this.baseElements.options.find(
            o => o.value === optionValue
        )!
    }

    get activeOption() {
        return this.baseElements.select.value
    }

    private createCustomSelect () {
        // Hide the original select element
        this.baseElements.select.style.display = "none"

        return createElement(
            "div",
            {class: `${TabSelectorController.componentName}-custom-select`},
        )
    }

    setActiveOption(optionValue: string) {
        if (optionValue !== this.activeOption) {
            if (!this.isValidOption(optionValue)) this.raiseOptionValueError(optionValue)

            this.baseElements.select.value = optionValue
            this.elementsMap[optionValue].baseElement.selected = true

            this.updateVisualState()
        }

        return this
    }

    private updateVisualState () {
        const activeOption = this.activeOption

        this.options.forEach(o => {
            const mapEntry = this.elementsMap[o]

            if (o === activeOption) {
                mapEntry.customElement.classList.add(this.activeClass)
                mapEntry.tabElement.style.display = ""
            } else {
                mapEntry.customElement.classList.remove(this.activeClass)
                mapEntry.tabElement.style.display = "none"
            }

        })
    }
}