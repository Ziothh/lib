export const useEnter = (
    textInput: HTMLInputElement, 
    callback: (e: KeyboardEvent) => void
) => textInput.addEventListener(
    "keydown", 
    (e) => {
        if(e.key === "Enter") {
            e.preventDefault()
            callback(e)
        }
    }
)