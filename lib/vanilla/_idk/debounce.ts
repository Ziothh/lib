// /** A wrapper function of the `useDebounce` `callback` parameter that starts the timeout.
//  * 
//  * It will start a timeout when the function is called and execute the callback after that timeout.
//  * 
//  * It also passes its arguments to the debounced callback.
//  * 
//  * If the function is called before the timeout has finished it will remove the previous timeout.
//  * 
//  * @returns the ID of the current timeout
//  */
const debounce = <Callback extends Function>(callback: Callback, delay: number) => {
    let timeout: number | null = null;


    const startTimer = (
        // @ts-ignore
        ...args: Parameters<Callback>
    ) => {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => callback(...args), delay)

        return timeout
    }
    
    return startTimer
}