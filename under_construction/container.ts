/** Will return a container based on the `name` param by checking for any element with a `data-container` attribute that matches. */


export const useContainer:
    ((name: string, multiplePossible?: false) => HTMLElement | null)
    & ((name: string, multiplePossible?: true) => NodeListOf<HTMLElement>)

    = (name: string, multiplePossible?: boolean): any => {
        const query = `[data-container="${name}"]`;
        return multiplePossible
            ? document.querySelectorAll(query)
            : document.querySelector(query)
    };
