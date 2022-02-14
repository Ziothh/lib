import { createElement } from "../DOM"
import { useEnter } from "../hooks/events"

const addTextSubmit = (
     textInput: HTMLInputElement, 
     createTextRepresentation: (submittedText: string) => HTMLLIElement 
) => {
    // State
    const textMap: Map<HTMLLIElement, string> = new Map()
    const actualValue: Set<string> = new Set()

    // Hidden input value
    const hiddenInput = textInput.previousElementSibling! as HTMLInputElement;
    const updateActualValue = () => {
        hiddenInput.value = JSON.stringify(Array.from(actualValue.values()))
    }

    // Mounting the tags container
    const submittedTextContainer = createElement("ul", {class: "submitted-text-container"}) as HTMLUListElement
    textInput.parentElement!.parentElement!.appendChild(submittedTextContainer)

    // Remove submited text
    const removeText = (textNode: HTMLLIElement) => {
        actualValue.delete(textMap.get(textNode)!)
        textMap.delete(textNode)
        submittedTextContainer.removeChild(textNode)

        updateActualValue()
    }

    // Add submited text
    const submitText = () => {
        if (textInput.value !== "" && !actualValue.has(textInput.value)){

        const submittedTag = createTextRepresentation(textInput.value)

        // Adding tag to the state
        textMap.set(submittedTag, textInput.value)
        actualValue.add(textInput.value)
        updateActualValue()

        // Onclick => remove
        submittedTag.onclick = () => removeText(submittedTag)

        submittedTextContainer.appendChild(submittedTag)
        }

        textInput.value = ""
    }

    // Button
    (textInput.nextElementSibling! as HTMLButtonElement).onclick = submitText
    // On enter
    useEnter(textInput, submitText);

    // Add the previous values
    (() => {
       (JSON.parse(hiddenInput.value) as string[]).forEach(
        prevValue => {
            const submittedTag = createTextRepresentation(prevValue)

            // Adding tag to the state
            textMap.set(submittedTag, prevValue)
            actualValue.add(prevValue)
            updateActualValue()

            // Onclick => remove
            submittedTag.onclick = () => removeText(submittedTag)

            submittedTextContainer.appendChild(submittedTag)
        }
       )
    })()
}

export const addTagInput = (tagInput: HTMLInputElement) => {
    addTextSubmit(tagInput, (submittedText: string) => {
        return createElement(
            "li", 
            {
                class: "submitted-tag", 
            },
            createElement(
                "button", 
                {
                    title: "Remove tag",
                    innerText: submittedText
                }, 
                createElement("i", {class: "fas fa-times"})
            ) 
        ) as HTMLLIElement
    })
}