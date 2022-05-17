export type Container = HTMLElement | Document

// export type AnyHTMLElement =
//     | HTMLDivElement
//     | HTMLInputElement
//     | HTMLParagraphElement
//     | HTMLElement

// export interface CustomEvent extends Event {
//     target: AnyHTMLElement
// }
// export interface CustomMouseEvent extends MouseEvent {
//     target: AnyHTMLElement
// }

export type HTMLTagName = keyof HTMLElementTagNameMap
