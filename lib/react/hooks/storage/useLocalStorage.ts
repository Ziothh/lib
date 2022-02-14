import useStorage from "./useStorage"

const useLocalStorage = <T>(key: string, defaultValue: T) => {
    return useStorage(key, defaultValue, window.localStorage)
}

export default useLocalStorage
