const throttleAsync = <A extends Parameters<any>>(asyncCallback: (...args: A) => Promise<void>) => {
    let shouldWait = false;
    let waitingArgs: A | null = null;

    const callPromise = () => {
        if (waitingArgs === null) {
            shouldWait = false
        } else {
            asyncCallback(...waitingArgs)
            .then(() => callPromise())
            waitingArgs = null
        }
    }


    return (...args: A) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        shouldWait = true

        asyncCallback(...args)
        .then(() => callPromise())
    }
}

export default throttleAsync