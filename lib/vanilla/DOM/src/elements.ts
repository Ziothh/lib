import type { AnyObject, CSSProperties } from "@ziothh/types";
import type { HTMLInputTypeAttribute } from "react";

interface ElementAttributes extends AnyObject {
    id?: string
    styles?: CSSProperties
    class?: string,
    title?: string

    // Input attributes
    type?: HTMLInputTypeAttribute
    required?: boolean

    // Dataset
    dataset?: AnyObject

    // Props that don't work with setAttribute
    innerText?: string
    innerHTML?: string

    // Events 
    onClick?: (ev: MouseEvent) => void,
    onChange?: (ev: Event | CustomEvent) => void,
}

export const createElement = <ElementName extends keyof HTMLElementTagNameMap>(
    htmlElement: ElementName, 
    attributes: ElementAttributes | null = null, 
    ...children: (HTMLElement | boolean | undefined | string)[]
) => {
    const elementInstance = document.createElement(htmlElement);
    if (attributes !== null){
        // Can't be set with setAttribute
        for (const prop of ["innerText", "innerHTML"]) {
            if (attributes[prop] !== undefined) {
                elementInstance[prop] = attributes[prop]
                delete attributes[prop]
            }
        }

        // Set attributes
        for (const [key, value] of Object.entries(attributes)) {
            if (key === "dataset") {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    elementInstance.dataset[dataKey] = (dataValue as any)
                }
            } else if (key.startsWith("on")) {
                document.addEventListener(key.replace("on", "").toLowerCase(), value)
            } else {
                
                elementInstance.setAttribute(key, value);
            }

        }
        // Can't be set with
        
    }

    children.forEach(c => {(c !== true && c !== false && c != undefined) && elementInstance.appendChild(
        typeof c === "string" ? document.createTextNode(c) : c
    )})

    return elementInstance;
};