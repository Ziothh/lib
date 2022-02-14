declare namespace MyTypes {
    namespace JS{
        interface AnyObject {
            [key: string]: any
        }

        interface BooleanObject {
            [key: string]: boolean
        }

        type Callback<T = void> = () => T
        type FilterCallback<T> = (value: T, index: number, array: T[]) => boolean 
    }
}