// Default types
export type InputValidationErrorMessageConstructor = (value: string, input: HTMLInputElement) => string

// Functions
export type InputValidatorFunction = (value: string, event: InputEvent) => string | null | false
export type InputFormatterFunction = (value: string, event: InputEvent) => string
export type InputPreValidatorFunction = (value: string) => boolean

export type InputAction = { type: "validator", callback: InputValidatorFunction } 
| { type: "formatter", callback: InputFormatterFunction }


// Options
export interface InputValidatorOptions {
    onInvalid?: (errorMessages: string[]) => void
    onValid?: () => void
}

// Config
type ValidityName = "required" | "pattern"

export default class InputValidator {
    public DEFAULT_VALIDATOR_MESSAGES: {
        [name in ValidityName]: InputValidationErrorMessageConstructor | string
    } = {
        required: "This field is required.",
        pattern: (value: string, input: HTMLInputElement) => `"${value}" does not match the pattern "${input.pattern}".`,
    }

    public onInvalid?: (invalidMessages: string[]) => void
    public onValid?: () => void

    public previousValue!: string

    public errorMessages: string[] = []

    constructor(
        public readonly input: HTMLInputElement, 
        {
            onInvalid,
            onValid,
        }: InputValidatorOptions = {}
    ) {
        this.onInvalid = onInvalid
        this.onValid = onValid

        this.updatePreviousValue()

        input.addEventListener("input", (e) => {
            this.errorMessages = []

            const {valid, valueMissing, patternMismatch, tooShort, tooLong, } = input.validity

            const setDefaultError = (name: ValidityName, error: boolean) => {
                if (error) {
                    const errorMessage = this.DEFAULT_VALIDATOR_MESSAGES[name]

                    this.errorMessages.push(
                        typeof errorMessage === "string"
                        ? errorMessage
                        : errorMessage(this.input.value, this.input)
                    )
                }
            }

            if (!valid) {
                setDefaultError("pattern", patternMismatch)
                setDefaultError("required", valueMissing)
            }

        })

        // if (input.required) this.addValidator(())

        // Make this always run last
        input.addEventListener("beforeinput", e => {
            input.addEventListener("input", () => {
                if (this.isValid) { 
                    if (this.onValid) this.onValid()
                    input.setCustomValidity("")
                }
                else { 
                    if (this.onInvalid) this.onInvalid(this.errorMessages)
                    input.setCustomValidity(this.errorMessages.join("\n"))
                }
            }, {once: true})
        })
    }

    get isValid() {
        return this.errorMessages.length === 0
    }
    get inputValue() {
        return this.input.value
    }

    private updatePreviousValue() {
        this.previousValue = this.input.value
    }

    addValidator(validator: InputValidatorFunction) {
        this.input.addEventListener("input", e => {
            const err = validator(this.inputValue, e as InputEvent)
            if (err) this.errorMessages.push(err)
        })

        return this
    }

    addInsertValidator(validator: InputPreValidatorFunction) {
        this.input.addEventListener("beforeinput", (e) => {
            if (e.inputType === "insertText" && (validator(e.data!) === false)) e.preventDefault()
        })

        return this
    }

    addFormatter(formatter: InputFormatterFunction) {
        this.input.addEventListener("input", e => {
            this.input.value = formatter(this.inputValue, e as InputEvent)
        })

        return this
    }
}