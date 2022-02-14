import { createElement } from "../../DOM"
import { getByDataAttribute } from "../../DOM/helpers";

export const addBasicSelect = (select: HTMLSelectElement) => {
    // Helpers 
    const toggleOpen = (value = !selectIsOpen) => {
        selectIsOpen = value
        container.classList[value ? "add" : "remove"](classes.open)
    }

    const setSelectedCustomOption = (optionValue: string) => {
        if (optionValue === currentValue) return

        // Update custom options state
        if (currentValue !== "") {
            const previouslySelectedCustomOption = getByDataAttribute("selected", "true", customSelectDiv)!
            previouslySelectedCustomOption.classList.remove(classes.selected)
            previouslySelectedCustomOption.dataset.selected = "false"
        } else if (select.required === true) {
            customSelectDiv.removeChild(getByDataAttribute("role", "placeholder", customSelectDiv)!)
        }
        const newlySelectedCustomOption = getByDataAttribute("value", optionValue)!
        newlySelectedCustomOption.classList.add(classes.selected)
        newlySelectedCustomOption.dataset.selected = "true"

        // Updating select state
        select.value = optionValue
        
        // console.log("previous value was:", currentValue);
        // options.forEach(o => console.log("option states:", o.innerHTML, o.selected))
        // console.log("select new value:", select.value);

        currentValue = optionValue

        select.dispatchEvent(new Event("changed-event")) // For react (cardapp page)
    }


    // Init
    // Setup
    select.classList.add("sronly")
    const container = select.parentElement!

    // Data
    const classes = {
        open: "select-input-container--open", // container
        selected: "custom-select-option--selected" // option
    } as const

    const options = select.querySelectorAll("option")

    // State
    let selectIsOpen: Boolean = null!
    let currentValue = select.value 

    // Custom select
    const customSelectDiv = createElement(
        "div",
        {
            class: `custom-select-container`,
            onClick: () => toggleOpen()
        },
        ...Array.from(options).map(option => createElement(
                "div", 
                {
                    class: `custom-select-option ${option.value === select.value ? classes.selected : ""}`,
                    dataset: {
                        value: option.value,
                        role: option.dataset.role as DataRole === "placeholder" ? "placeholder" : undefined,
                        selected: option.selected
                    },
                    onClick: () => {
                        const value = option.value
                        setSelectedCustomOption(value)
                        select.value = value
                    }
                }, 
                createElement("p", null, option.innerText)
            )
        )
    )

    container.appendChild(customSelectDiv)

    // Functionality
    select.addEventListener("change", () => setSelectedCustomOption(select.value))

    document.addEventListener("click", ({target}) => selectIsOpen && !customSelectDiv.contains(target as any) && toggleOpen(false))
    
    return customSelectDiv as HTMLDivElement
}