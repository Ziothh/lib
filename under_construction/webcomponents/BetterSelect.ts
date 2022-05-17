// import { createElement }  from "../DOM"

const template = document.createElement("template")
template.innerHTML = `
    <style>
    </style>

    <div class="BetterSelect-container">
        
        <slot></slot>
    </div>
`

export default class BetterSelect extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(template.cloneNode(true))
    }

    connectedCallback() {}
    disconnectedCallback() {}
}

const registerBetterSelect = () => {window.customElements.define("better-select", BetterSelect)}