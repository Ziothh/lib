export const addFilesToInput = (files: File[], input: HTMLInputElement, keepOldFiles: boolean = true) => {
    const dataTransfer = new DataTransfer()
    files.forEach(f => dataTransfer.items.add(f))

    if (keepOldFiles) {
        for (let index = 0; index < input.files!.length; index++) {
            dataTransfer.items.add(input.files![index])
        }
    }

    input.files = dataTransfer.files
} 