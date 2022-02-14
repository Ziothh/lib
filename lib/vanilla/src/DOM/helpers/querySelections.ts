import { generateDataAttribute } from "./generation"

/** querySelects on `data-${attribute}="${value}"`  */
export const getByDataAttribute = (
    name: string,
    value: string,
    container: MyTypes.HTML.Container = document,
): HTMLElement | null => container.querySelector(generateDataAttribute(name, value))

export const getAllByDataAttribute = (
    name: string,
    value: string,
    container: MyTypes.HTML.Container = document,
): NodeListOf<HTMLElement> => container.querySelectorAll(generateDataAttribute(name, value))


export const getComponent = (componentName: DataComponent) => getByDataAttribute("component", componentName)
export const getAllComponents = (componentName: DataComponent) => getAllByDataAttribute("component", componentName)