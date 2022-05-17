export interface AnyObject {
    [key: string]: any
}

export interface BooleanObject {
    [key: string]: boolean
}

export type Callback<T = void> = () => T
export type FilterCallback<T> = (value: T, index: number, array: T[]) => boolean 