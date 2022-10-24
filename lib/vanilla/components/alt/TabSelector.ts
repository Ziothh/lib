interface ClassNames {
    activeButton?: string
    activeTab?: string
}

interface Options {
    classNames?: ClassNames
}

export default class TabSelectorController {
    public readonly classNames: ClassNames
    private readonly linkMap = new Map<number, {
        button: HTMLButtonElement
        tab: HTMLElement
    }>()

    constructor({
        classNames
    }: Options = {}) {
        this.classNames = {
            activeButton: "active-tab-selector",
            activeTab: "active-tab",
            ...classNames
        }
    }

    get currentActive() {
        return [...this.linkMap.values()].find(
            elements => elements.button.classList.contains(this.classNames.activeButton!)
            || elements.tab.classList.contains(this.classNames.activeTab!)
        )
    }

    setActive(tabID: number) {
        const prev = this.currentActive
        const next = this.linkMap.get(tabID)

        if (prev !== undefined) {
            prev.button.classList.remove(this.classNames.activeButton!)
            prev.tab.classList.remove(this.classNames.activeTab!)
        }

        next!.button.classList.add(this.classNames.activeButton!)
        next!.tab.classList.add(this.classNames.activeTab!)
    } 

    linkButtonToTab(button: HTMLButtonElement, tab: HTMLElement) {
        if (button === undefined) throw new Error("The linked button can not be undefined")
        if (tab === undefined) throw new Error("The linked tab can not be undefined")

        const ID = this.linkMap.size
        this.linkMap.set(ID, {button, tab})

        button.addEventListener("click", () => this.setActive(ID))
    }
}