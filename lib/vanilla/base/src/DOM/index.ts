
// export const getFormElement = (name, form?: HTMLFormElement) => form === undefined
//     ? document.getElementsByName(name)[0] as HTMLInputElement | HTMLSelectElement
//     : form.querySelector(`[name="${name}"]`)

// export const getElement = (ID) => document.getElementById(ID);

/**
 * Creates a HTML element
 */


export * from "./helpers"
export * from "./elements"

/**
 * Renders a element in the given parent
 */
export const render = (element: HTMLElement, parent: HTMLElement, mode: "insertBefore" | "insertAfter" | "replace" = "replace") => {
    if (mode === "replace") parent.innerHTML = element.outerHTML
    else if (mode === "insertAfter") parent.appendChild(element)
    else parent.prepend(element)
}