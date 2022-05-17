export interface PassedState<T> {
    value: T
    set: React.Dispatch<React.SetStateAction<T>>
}


export type StateObject<T> = {
    value: T
    set: React.Dispatch<React.SetStateAction<T>>
    options?: T extends any[]
    ? T 
    : T extends Set<any>
        ? any[]
        : T[]
}