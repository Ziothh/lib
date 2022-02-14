
// export const getFormElement = (name, form?: HTMLFormElement) => form === undefined
//     ? document.getElementsByName(name)[0] as HTMLInputElement | HTMLSelectElement
//     : form.querySelector(`[name="${name}"]`)

// export const getElement = (ID) => document.getElementById(ID);

/**
 * Creates a HTML element
 */
import type { Properties as CSSProperties } from "csstype"
import type { HTMLInputTypeAttribute } from "react";

export * as Helpers from "./helpers"


interface ElementAttributes extends MyTypes.JS.AnyObject {
    id?: string
    styles?: CSSProperties
    class?: string,
    title?: string
    type?: HTMLInputTypeAttribute

    // Dataset
    dataset?: MyTypes.JS.AnyObject

    // Weird props that don't work with setAttribute
    innerText?: string
    innerHTML?: string

    // Events 
    onClick?: (ev: MouseEvent | MyTypes.HTML.CustomMouseEvent) => void,
    onChange?: (ev: Event | CustomEvent) => void,
}

export const createElement = <ElementName extends keyof HTMLElementTagNameMap>(htmlElement: ElementName, attributes: ElementAttributes | null = null, ...children: (HTMLElement | boolean | undefined | string)[]) => {
    const elementInstance = document.createElement(htmlElement);
    if (attributes !== null){
        for (const [key, value] of Object.entries(attributes)) {
            if (key === "dataset") {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    elementInstance.dataset[dataKey] = (dataValue as any)
                }
            } else {
                elementInstance.setAttribute(key, value);
            }

        }
        // Can't be set with
        if(attributes.onClick) elementInstance.onclick = attributes.onClick
        if(attributes.onChange) elementInstance.onchange = attributes.onChange
        if(attributes.innerText) elementInstance.innerText = attributes.innerText
        if(attributes.innerHTML) elementInstance.innerHTML = attributes.innerHTML
    }

    children.forEach(c => {(c !== true && c !== false && c != undefined) && elementInstance.appendChild(
        typeof c === "string" ? document.createTextNode(c) : c
    )})

    return elementInstance;
};

// /**
//  * Renders a component in the given parent
//  */
// export const renderElement = (component, parentID: string) => {
//     document.getElementById(parentID)?.appendChild(component())
// };

export const getChildList = (element) => Array.from(element.children);


export const render = (element: HTMLElement, parent: HTMLElement) => {
    parent.innerHTML = element.outerHTML
}