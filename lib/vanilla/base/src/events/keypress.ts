// import { EventListenerController, N_EventListenerController } from "."
// import { EventMap } from "./types"

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

// export const useKeypress = (
//     callbackMap: {[key in keyof EventMap]: N_EventListenerController.Callback<key>},
//     mode: "code" | "key" = "key",   
// ) => Object.keys(callbackMap).reduce<{[key in keyof EventMap]: EventListenerController<key>}>((acc, key) => ({
//     ...acc,
//     [key]: new EventListenerController(key, )
// }), {})