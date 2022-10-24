/**
 * Returns a wrapper function of the callback that when called executes after the given delay.\
 * 
 * The wrapper function resets the delay every time it is called.\
 * If the wrapper function is executed again before the delay of the previous call
 * has ended it will cancel the previous call, reset the delay and run when the new delay has ended.
 * 
 * @default delay = 500 // (in ms)
 */
const debounce = <A extends Parameters<any>>(callback: (...args: A) => void, delay = 500) => {
    let timeout: number | null = null;

    return ((...args: A) => {
        clearTimeout(timeout!)
        timeout = setTimeout(() => {
            callback(...args)
        }, delay)
    })
}

export default debounce