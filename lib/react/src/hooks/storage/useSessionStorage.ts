import useStorage from "./useStorage"

const useSessionStorage = <T>(key: string, defaultValue?: T) => {
    return useStorage<T>(key, window.sessionStorage, defaultValue)
}

export default useSessionStorage
