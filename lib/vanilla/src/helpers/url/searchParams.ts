export const getSearchParams = (url: string | URL = new URL(window.location.href)) => {
    if (typeof url === "string") {
        url = new URL(url)
    }

    const urlParams = typeof url === "string" 
    ? new URL(url).searchParams
    : url.searchParams

    const searchParams = new Object()

    // @ts-ignore
    for (const [key, value] of (urlParams.entries() as [string, string][])) {
        const [keyName, secondGroup] = key.split("[]")

        if (secondGroup === undefined) {
            searchParams[keyName] = value
        } else {
            if (searchParams.hasOwnProperty(keyName)) {
                console.log(searchParams[keyName].append);
                searchParams[keyName].push(value)
            } else {
                searchParams[keyName] = [value]
            }
        }
    }

    return (searchParams as {[key: string]: string | string[]})
}

export const objectToSearchParams = <T extends Object>(object: T) => {
    const searchParams = new URLSearchParams()

    Object.entries(object).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            (value as string[]).forEach(v => searchParams.append(key, v))
        } else {
            console.log(value);
            searchParams.append(key, value)
        }
    })

    return searchParams
}