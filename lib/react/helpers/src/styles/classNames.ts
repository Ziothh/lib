// const classNames = (...classNames: (string | false | {[className: string]: boolean})[]) => {
//     return classNames.reduce<string>((acc, className) => {
//         if (className) {
//             if (typeof className === "string") {
//                 acc += " " + className
//             } else {
//                 Object.entries(className).forEach(([key, value]) => {
//                     if (value) {
//                         acc += " " + key
//                     }
//                 })
//             }
//         }
//         return acc
//     }, "")
// }

const classNames = (...classNames: (string | false | {[className: string]: boolean})[]) => {
    "use strinct";

    const hasOwn = {}.hasOwnProperty;

    let classNameList: string[] = []

    for (let i = 0; i < classNames.length; i++) {
        const arg = classNames[i];

        if (!arg) continue

        const argType = typeof arg

        if (argType === "string") {
            classNameList.push(arg as string)
        } else if (argType === "object") {
            if (arg.toString === Object.prototype.toString) {
                for (var key in arg as {[className: string]: boolean}) {
                    if (hasOwn.call(arg, key) && arg[key]) {
                        classNameList.push(key);
                    }
                }
            } else {
                classNameList.push(arg.toString());
            }
        }
    }
}

export default classNames
