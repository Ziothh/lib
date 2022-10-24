import useStorage from "./useStorage"

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
    return useStorage(key, window.localStorage, defaultValue)
}

export default useLocalStorage
