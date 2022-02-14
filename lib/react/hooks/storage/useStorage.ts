import { useCallback, useEffect, useState } from "react"

/** Returns the `key` value of the storage (or the given `defaultValue` if nothing was found)
 * as [state, setState, remove]
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

    return [value, setValue, remove] as const
}

export default useStorage
