import { useCallback, useEffect, useState } from "react"

// TODO: look for a fix for when the key changes

/** Returns the `key` value of the storage (or the given `defaultValue` if nothing was found)
 * as `[state, setState, remove]`
 * 
 * `remove`: deletes the key value in the storage
*/
const useStorage = <T>(key: string, defaultValue: T, storageObject: Storage) => {
    const [value, setValue] = useState<T | undefined>(() => {
        const jsonValue = storageObject.getItem(key)

        if (jsonValue != null) return JSON.parse(jsonValue)

        return typeof defaultValue === "function"
            ? defaultValue()
            : defaultValue
    })

    useEffect(() => {
        if (value === undefined) return storageObject.removeItem(key)
        
        storageObject.setItem(key, JSON.stringify(value))
    }, [key, value, storageObject])

    const remove = useCallback(() => {
        setValue(undefined)
    }, []) 

    return [
        (value as T | undefined), 
        (setValue as React.Dispatch<React.SetStateAction<T>>), 
        remove
    ] as const
}

export default useStorage
