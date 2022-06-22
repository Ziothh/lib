import { useEffect, useRef } from "react"

const useEventListener = <T extends keyof DocumentEventMap, E extends HTMLElement | Document | Window | EventTarget = Document>(
    type: T, 
    listener: (e: {target: E} & DocumentEventMap[T]) => void,
    {
        autoAdd = true,
        // @ts-ignore
        element = document,
        fireOnce = false
    }: {
        element?: E,
        fireOnce?: boolean
        autoAdd?: boolean
    } = {}
) => {
    const listenerRef = useRef<(e: any) => any>()
    listenerRef.current = listener

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
    } as const
}

export default useEventListener
