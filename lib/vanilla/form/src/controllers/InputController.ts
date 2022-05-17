import InputValidator, { InputValidatorOptions } from "./InputValidator"

export default class InputController {
    public errors: string[] = []
    public readonly validator: InputValidator

    constructor(
        public readonly inputElement: HTMLInputElement,
    ) {
        this.validator = new InputValidator(inputElement)
    }

    on(
        type: "change" | "blur" | "input", 
        callback: (e: {target: HTMLInputElement} & Event) => void,
        once = false
    ) {
        this.inputElement.addEventListener(type, callback as any, {once})
        return () => this.inputElement.removeEventListener(type, callback as any)
    }

    onValid(callback: NonNullable<InstanceType<typeof InputValidator>["onValid"]>) {
        this.validator.onValid = callback
    }
    onInvalid(callback: NonNullable<InstanceType<typeof InputValidator>["onInvalid"]>) {
        this.validator.onInvalid = callback
    }

    get value() {
        return this.inputElement.value
    }

    get name () {
        return this.inputElement.name
    }

}