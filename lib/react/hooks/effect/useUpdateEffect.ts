import type { DependencyList } from "react"
import { useEffect, useRef } from "react"

/** A variation of the `useEffect` React hook. 
 * 
 * Doesn't run the first time the component renders and only runs when 
 * a value inside de dependency list changes.
*/
const useUpdateEffect = (callback: MyTypes.JS.Callback, dependencies: DependencyList) => {
    // Tells the function if the component is on it's first render
    const firstRenderRef = useRef(true) 
    
    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false
            return
        }
        return callback()
    }, dependencies)
}

export default useUpdateEffect
