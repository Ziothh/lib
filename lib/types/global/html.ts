declare namespace MyTypes {
    export namespace HTML {
        type Container = HTMLElement | Document

        type AnyHTMLElement =
            | HTMLDivElement
            | HTMLInputElement
            | HTMLParagraphElement
            | HTMLElement

        interface CustomEvent extends Event {
            target: AnyHTMLElement
        }
        interface CustomMouseEvent extends MouseEvent {
            target: AnyHTMLElement
        }

        type HTMLTagName = keyof HTMLElementTagNameMap
    }
}
