/**
 * Returns a wrapper function of the callback that when called executes once and then sets a delay.\
 * 
 * If the wrapper function is called again before the previous delay has ran out it won't execute.\
 * If the wrapper function was called again during an active delay and then that delay runs out it will
 * call the callback function one last time.
 * 
 * @default delay = 500 // (in ms)
 */
const throttle = <A extends Parameters<any>>(callback: (...args: A) => void, delay = 500) => {
    let shouldWait = false;
    let waitingArgs: A | null = null;

    const timeOutCallback = () => {
        if (waitingArgs === null) {
            shouldWait = false
        } else {
            callback(...waitingArgs)
            waitingArgs = null

            setTimeout(timeOutCallback, delay)
        }
    }

    return (...args: A) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        callback(...args)
        shouldWait = true

        setTimeout(timeOutCallback, delay)
    }
}


export default throttle