const classNames = (...classNames: (string | false | {[className: string]: boolean})[]) => {
    return classNames.reduce<string>((acc, className) => {
        if (className) {
            if (typeof className === "string") {
                acc += " " + className
            } else {
                Object.entries(className).forEach(([key, value]) => {
                    if (value) {
                        acc += " " + key
                    }
                })
            }
        }
        return acc
    }, "")
}

export default classNames
