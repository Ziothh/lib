import type { DependencyList } from "react"
import { useEffect } from "react"
import { useTimeout } from "."


/** Only runs the given `callback` function after the set delay. 
 * 
 * The countdown will start if one of the `dependencies` has changed.
 * 
 * It will then restart everytime another change happens.
*/
const useDebounce = (callback: Callback, delay: number, dependencies: DependencyList = []) => {
    const { clear, reset } = useTimeout(callback, delay)   

    // Will restart the countdown every time a change happens
    useEffect(reset, [...dependencies, reset])

    // Prevents the countdown from starting by default.
    useEffect(clear, [])
}


export default useDebounce
