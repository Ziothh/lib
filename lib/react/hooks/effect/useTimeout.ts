import { useCallback, useEffect, useRef } from "react"
import { useUpdateEffect } from "."

/** Will run the given `callback` function after the given `delay`.
 * 
 * Returns: 
 *  - `clear`: a function that removes the current timeout.
 *  - `reset`: a function that removes the current timeout and starts a new one.
 */
const useTimeout = (callback: MyTypes.JS.Callback, delay: number, runOnFirstComponentRender: boolean = true) => {
    // Using refs instead of passing a function with useCallback when calling useTimeout
    const callbackRef = useRef(callback)
    const timeoutRef = useRef<any>()

    // Updates the callback function everytime it changes changes 
    // ( => on component render)
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    
    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
    }, [delay])

    /** Removes the set timeout. */
    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [])

    // Should run on first component render or not
    const effectMethod = runOnFirstComponentRender ? useEffect : useUpdateEffect

    effectMethod(() => {
        set()
        return clear
    }, [delay, set, clear])


    /** Removes the current timeout (if it hasn't completed yet) 
     * and sets a new one. */
    const reset = useCallback(() => {
        clear()
        set()
    }, [clear, set])


    return {
        reset, 
        clear
    }
}

export default useTimeout