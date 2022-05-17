import InputController from "./InputController"

export default class BaseFormController {
    public inputs: {
        [name: string]: InputController
    } = {}

    register(input: HTMLInputElement) {
        this.inputs[input.name] = new InputController(input)
    }

    toJSON() {
        return Object.entries(this.inputs)
        .reduce<{[name: string]: string}>((acc, [name, input]) => {
            return {...acc, [name]: input.value}
        }, {})
    }
}