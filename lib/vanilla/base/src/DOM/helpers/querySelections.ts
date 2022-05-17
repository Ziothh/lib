import type {Container} from "@ziothh/types"
import { generateDataAttribute } from "./generation"

type $QueryFunc = 
(<K extends keyof HTMLElementTagNameMap>(selectors: K, container?: Container) => HTMLElementTagNameMap[K] | null)
& (<K extends keyof SVGElementTagNameMap>(selectors: K, container?: Container) => SVGElementTagNameMap[K] | null)
& (<E extends HTMLElement = HTMLElement>(selectors: string, container?: Container) => E | null)
/** A shorthand for [container].querySelector */
export const $: $QueryFunc = (query, container: Container = document) => container.querySelector(query)

type $$QueryFunc = 
(<K extends keyof HTMLElementTagNameMap>(selectors: K, container?: Container) => (HTMLElementTagNameMap[K])[])
& (<K extends keyof SVGElementTagNameMap>(selectors: K, container?: Container) => (SVGElementTagNameMap[K])[])
& (<E extends HTMLElement = HTMLElement>(selectors: string, container?: Container) => E[])
/** A shorthand for [container].querySelectorAll */
export const $$: $$QueryFunc =(query, container: Container = document) => [...container.querySelectorAll(query)]

/** querySelects on `data-${attribute}="${value}"`  */
export const getByDataAttribute = <E extends HTMLElement>(
    name: string,
    value: string,
    container: Container = document,
): E | null => $<E>(generateDataAttribute(name, value), container)

/** querySelects on `data-${attribute}="${value}"`  */
export const getAllByDataAttribute = <E extends HTMLElement>(
    name: string,
    value: string,
    container: Container = document,
) => $$<E>(generateDataAttribute(name, value), container)

/** querySelects on `data-component="${value}"`  */
// export const getComponent = (componentName: DataComponent) => getByDataAttribute("component", componentName)
// /** querySelects on `data-component="${value}"`  */
// export const getAllComponents = (componentName: DataComponent) => getAllByDataAttribute("component", componentName)

