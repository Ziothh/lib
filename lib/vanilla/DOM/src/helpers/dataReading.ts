const isValidFileType = (fileType: string, possibleTypes: string[] | string) => {
    if (typeof possibleTypes === "string") possibleTypes = possibleTypes.split(",").map(pt => pt.replaceAll(" ", ""))
    return possibleTypes.some(
    pType => {
        // If the possible file type is like "category/*""
        const category = pType.match(/[a-zA-Z]*\/\*/)?.shift().replace("*","")
        if (category) {
            if (fileType.match(category)) return true
        } else {
            // Check for basic file types ".ext"
            if (fileType.match(/[\w]*\/(.*)/)[1] === pType.replace(".", "")) {
                return true
            }
        }
    }
)}

export const readFileDataUrl = (
    file: File,
    allowedFileTypes?:  string
): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader()

    if (allowedFileTypes === undefined || isValidFileType(file.type, allowedFileTypes)) {
        reader.addEventListener("load", () => resolve(reader.result as string))
        reader.readAsDataURL(file)
    } else {
        reject(`Invalid file type. File type: "${file.type}". Doesn't match "${allowedFileTypes}"`)
    }
})

export const readFileInputImagesUrl = async (
    fileInput: HTMLInputElement, 
    onWrongFileType?: (fileType: string) => void,
): Promise<string[]> => await Promise.all(
    ([...fileInput.files!]).map(f => readFileDataUrl(f, fileInput.accept))
)

    // console.log()
    // fileInput.addEventListener("change", () => {
    //     const reader = new FileReader();

        
    //     const fileType = fileInput.files![0].type

    //     if (isValidFileType(fileType, fileInput.accept)) {
    //         reader.addEventListener("load", () => {
    //             callback(reader);
    //         });
    //     } else {
    //         onWrongFileType && onWrongFileType(fileType)
    //     }

    //     reader.readAsDataURL(fileInput.files![0]);

    //     reader
    // });

