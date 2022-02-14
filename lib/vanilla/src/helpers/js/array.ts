export const arrayToBoolObject = (array: string[]) => array.reduce(
    (acc, arrElement) => {
        acc[arrElement] = false
        return acc
    }, 
    {} as MyTypes.JS.BooleanObject
)
