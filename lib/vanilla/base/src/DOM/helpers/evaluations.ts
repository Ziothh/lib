export const elementInList = (element: HTMLElement, list: NodeListOf<HTMLElement> | HTMLElement[]) => (Array.isArray(list) ? list : Array.from(list)).includes(element)
