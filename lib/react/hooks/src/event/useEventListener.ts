import { useEffect, useRef } from "react"

const useEventListener = <T extends keyof DocumentEventMap, E extends HTMLElement | Document | Window>(
    type: T, 
    listener: (e: {target: E} & DocumentEventMap[T]) => void,
    options: {
        element?: E,
        fireOnce?: boolean
    } = {}
) => {
    const listenerRef = useRef<(e: any) => any>()
    listenerRef.current = listener

    const {element = document, fireOnce = false} = options

    const addEventListener = () => element.addEventListener(type, listenerRef.current!, {once: fireOnce})
    const removeEventListener = () => element.removeEventListener(type, listenerRef.current!)
   
    useEffect(() => {
        addEventListener()
        return removeEventListener
    }, [listenerRef, fireOnce, type, element])

    return {
        callback: listenerRef.current,
        add: addEventListener,
        remove: removeEventListener,
        firesOnce: fireOnce,
        element,
    }
}

export default useEventListener
