import { useContext } from "react"
import { createContext, useRef } from "react"


const contextFactory = <T, >(contextValue: () => T) => {
    // const stateFunctionRef = useRef(state)

    const ctx = createContext<T>(null!)


    const CtxProvider: React.FC = ({children}) => {
        const stateFunctionRef = useRef<typeof contextValue>()
        stateFunctionRef.current = contextValue
        
        const value = stateFunctionRef.current()
        return (
            <ctx.Provider value={value}>
                {children}
            </ctx.Provider>
        )
    }

    const useCtx = () => useContext(ctx)

    return [CtxProvider, useCtx] as const
}

export default contextFactory