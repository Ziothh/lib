import { getByDataAttribute } from "../DOM/helpers";

// prettier-ignore
export const getBlueprint = (blueprintName: string, container: HTMLElement | Document = document) => getByDataAttribute("blueprint", blueprintName, container) as HTMLElement;


export const useBlueprint = <T extends HTMLElement>(
    blueprint: T | string,
    {
        container = document,
        remove = true,
        autoUpdateBlueprint = false
    }: {
        container?: HTMLElement | Document, 
        remove?: boolean, 
        autoUpdateBlueprint?: boolean
    } = {}
): [(props?: MyTypes.JS.AnyObject) => T, T] => {
    if (typeof blueprint === "string") blueprint = getBlueprint(blueprint, container) as T;
    remove && blueprint.remove();

    // If the blueprint has keep the changes that have been made
    const toCopy = autoUpdateBlueprint ? blueprint : blueprint.cloneNode()

    return [
        (props: MyTypes.JS.AnyObject = {}) => {
            const bpCopy = toCopy.cloneNode() as T;

            for (const [key, value] of Object.entries(props)) {
                bpCopy.setAttribute(key, value);
            }

            return bpCopy;
        },
        blueprint,
    ];
};
