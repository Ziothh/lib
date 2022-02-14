import { createElement } from "../DOM"
import { getByDataAttribute } from "../DOM/helpers"

export const addTextareaMaxLengthCounter = (container: HTMLDivElement) => {
    const label = container.querySelector("label")!
    
    const textareaMode = container.dataset.textareaMode as "default" | "wysiwyg"

    const textarea = textareaMode === "default" 
    ? container.querySelector("textarea")!
    : container.querySelector("[data-wysiwyg-input]")! as HTMLInputElement


    const maxLength = textarea.maxLength 

    const counter = createElement("span", {class: "counter-number", innerText: JSON.stringify(maxLength - textarea.value.length)})
    const counterText = createElement("small", {class: "textarea-counter"}, counter, createElement("span", {innerText: "characters remaining"}))

    
    if (textareaMode === "default") {
        textarea.addEventListener("input", ({target}) => {
            counter.innerText = JSON.stringify(
                maxLength - (target as HTMLTextAreaElement).value.length
            )
        })
    } else {
        // @ts-ignore
        editor.on('text-change', () => {
            counter.innerText = JSON.stringify(
                // @ts-ignore
                maxLength - (editor.getLength() - 1)
            )
        });
    }

    label.appendChild(counterText)
}


