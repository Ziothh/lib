import { useState } from "react"

// Todo: make overloads
const useStateObject = <T>(defaultValue: T, options?: T extends any[]
    ? T 
    : T extends Set<any>
        ? any[]
        : T[]): StateObject<T> => {
    const [state, setState] = useState(defaultValue)

    return {
        value: state,
        set: setState,
        options: options
    }
}

export default useStateObject