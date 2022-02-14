import { createContext, useContext, useReducer } from "react"


const createStore = <
    State,
    Reducer extends React.Reducer<State, any>
>(
    reducer: Reducer, 
    initialState: State
) => {
    const context = createContext<{
        store: State,
        dispatch: React.Dispatch<React.ReducerAction<Reducer>>
    }>(null!)

    const [state, dispatch] = useReducer(
        reducer,
        (initialState as React.ReducerState<Reducer>)
    )

    const StoreProvider: React.FC = ({ children }) => {
        return (
            <context.Provider value={{
                store: (state as State), 
                dispatch
            }}>
                {children}
            </context.Provider>
        )
    }

    const useDispatch = () => {
        const { dispatch } = useContext(context)
        return dispatch
    }
    
    const useStore = () => {
        const {store} = useContext(context)
        return store
    }
    
    return [StoreProvider, useStore, useDispatch] as const
}

export default createStore
