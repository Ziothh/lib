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

export const useKeypress = (
    callbackMap: {[key: string]: () => void}, 
    mode: "code" | "key" = "key"
) => document.addEventListener("keydown", e => {
    callbackMap[e[mode]]()
})