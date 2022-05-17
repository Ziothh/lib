// import BaseFormController from "./BaseFormController"
// import InputController from "./InputController"

// export default class FormController extends BaseFormController {
//     public inputs: {
//         [name: string]: InputController
//     } = {}

//     public submitButton?: HTMLInputElement | HTMLButtonElement


//     constructor(public readonly formElement?: HTMLFormElement) {
//         if (formElement !== undefined) {
//             this._autoAssign()
//         }
//     }

//     _autoAssign(formElement?: HTMLFormElement) {
//         // @ts-ignore
//         if (this.formElement === undefined) this.formElement = formElement!
//         formElement.querySelectorAll("input").forEach(i => {
//             if (i.type !== "submit") this.register(i)
//         })

//         this.linkSubmitButton(formElement.querySelector("[type='submit']"))
//     }

//     register(input: HTMLInputElement) {
//         this.inputs[input.name] = new InputController(input)
//     }

//     linkSubmitButton(button: HTMLInputElement | HTMLButtonElement) {
//         this.submitButton = button
//     }

//     linkRepeatValidation(referenceName, repeaterName, errorMessage = `${referenceName} & ${repeaterName} do not match.`) {
//         const referenceController = this.inputs[referenceName]
//         const repeaterController = this.inputs[repeaterName]

//         repeaterController.inputElement.addEventListener("blur", () => {
//             repeaterController.validator.addValidator(
//                 () => referenceController.value === repeaterController.value && errorMessage
//             )
//         })
//     }
    


// }