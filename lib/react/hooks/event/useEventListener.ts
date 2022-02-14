import { useEffect, useRef } from "react"

const useEventListener = <T extends keyof DocumentEventMap, E extends HTMLElement>(
    type: T, 
    listener: (e: {target: E} & DocumentEventMap[T]) => any,
    options: {
        element?: E | Document,
        fireOnce?: boolean
    } = {}
) => {
    const listenerRef = useRef<(e: any) => any>()
    listenerRef.current = listener

    const {element = document, fireOnce = false} = options
   
    useEffect(() => {
        element.addEventListener(type, listenerRef.current!, fireOnce)
        return () => element.removeEventListener(type, listenerRef.current!, fireOnce)
    }, [listenerRef, fireOnce, type, element])
}

export default useEventListener
