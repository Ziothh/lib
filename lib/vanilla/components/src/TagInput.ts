import { createElement } from "@ziothh/vanilla-base"

interface TagInputClassNames {
    tagList?: string
}

type TagTemplate = (tagValue: string) => HTMLLIElement

export default class TagInput {
    public readonly inputElement: HTMLInputElement
    public readonly tagList: HTMLUListElement
    private readonly tagTemplate: TagTemplate

    public readonly classNames: {
        // tagItem: string
        tagList: string
    }

    public tagElements: Set<HTMLLIElement> = new Set()

    constructor(
        public readonly container: HTMLElement, 
        {tagList = "tag-list", tagTemplate}: {tagTemplate: TagTemplate} & TagInputClassNames
    ) {
        this.inputElement = container.querySelector<HTMLInputElement>("input[type='text']")!
        this.tagTemplate = tagTemplate
        this.classNames = {tagList}

        // Creating the list
        this.tagList = createElement("ul", {class: this.classNames.tagList})
        container.appendChild(this.tagList)

        // Setting the event listeners
        this.inputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this.submitTag()
            }
        })
    }

    get tagValues() {
        return [...this.tagElements.values()].map(t => t.innerText)
    }

    private createTag(tagValue: string) {
        const tagElement = this.tagTemplate(tagValue)
        tagElement.addEventListener("click", () => {this.removeTag(tagElement)})
        return tagElement
    }

    renderTags() {
        this.tagList.replaceChildren(...this.tagElements.values())
    }

    addTag(value: string) {
        this.tagElements.add(this.createTag(value))
        this.renderTags()
    }

    removeTag(tagElement: HTMLLIElement) {
        this.tagElements.delete(tagElement)
        this.renderTags()
    }

    submitTag() {
        this.addTag(this.inputElement.value)
        this.inputElement.value = ""
    }

    assignSubmitButton(button: HTMLElement) {
        // button.addEventListener()
    }
}