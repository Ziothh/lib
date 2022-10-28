interface ClassNames {
    activeButton?: string
    activeTab?: string
}

interface Options {
    classNames?: ClassNames
}

type LinkMapId = string | number

export default class TabSelectorController {
    public readonly classNames: ClassNames
    private readonly linkMap = new Map<LinkMapId, {
        buttons: Set<HTMLElement>
        tabs: Set<HTMLElement>
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
            elements => [...elements.buttons.values()].every(b => b.classList.contains(this.classNames.activeButton!))
            || [...elements.tabs.values()].every(t => t.classList.contains(this.classNames.activeTab!))
        )
    }

    setActive(tabID: LinkMapId) {
        const prev = this.currentActive
        const next = this.linkMap.get(tabID)

        if (prev !== undefined) {
            prev.buttons.forEach(b => b.classList.remove(this.classNames.activeButton!))
            prev.tabs.forEach(t => t.classList.remove(this.classNames.activeTab!))
        }

        next!.buttons.forEach(b => b.classList.add(this.classNames.activeButton!))
        next!.tabs.forEach(t => t.classList.add(this.classNames.activeTab!))
    } 

    /** @param ID the ID of the relation of the buttons and the tabs */
    link(ID: LinkMapId, button: HTMLElement | HTMLElement[], tab: HTMLElement | HTMLElement[]) {
        if (button === undefined) throw new Error("The linked button can not be undefined")
        if (tab === undefined) throw new Error("The linked tab can not be undefined")

        const buttons = Array.isArray(button) ? button : [button]
        const tabs = Array.isArray(tab) ? tab : [tab]

        const prev = this.linkMap.get(ID)

        const newButtons = prev 
        ? buttons.filter(b => !prev.buttons.has(b))
        : buttons

        this.linkMap.set(
            ID, 
            prev 
            ? {
                buttons: new Set([...prev.buttons.values(), ...newButtons]),
                tabs: new Set([...prev.tabs, ...tabs])
            }
            : {
                buttons: new Set(newButtons),
                tabs: new Set(tabs), 
            }
        ) 
        // if (prev) {
        // }
        // const ID = this.linkMap.size

        newButtons.forEach(b => b.addEventListener("click", () => this.setActive(ID)))
    }
}