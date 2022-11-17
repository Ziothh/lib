// const countUpOverTime = (
//     element: HTMLElement, 
//     duration: number = 1000
// ) => new Promise((res) => {
//     let timePassed = 0
//     const loopDelta = 1000 / 60 // 1s / 60hz

//     const value = parseFloat(element.innerText.replace(".", "").replace(",", "."))
//     const maxLength = element.innerText.length

//     const loop = () => {
//         if (timePassed > duration + loopDelta) return res(undefined)

        
//         const percentage = timePassed / duration

//         const valueAsString = `${
//             value * Math.min(percentage, 1)
//         }`.slice(0, maxLength).replace(".", ",")
        
//         element.innerHTML = valueAsString.endsWith(",")
//         ? valueAsString.slice(0, valueAsString.length - 1)
//         : valueAsString

        
        
//         timePassed += loopDelta
//         requestAnimationFrame(loop)
//     }

//     loop()
// })

// export default countUpOverTime

type CountUpOverTimeListener = (currentValue: number, percentage: number, maxValue: number) => void
export default class CountUpOverTimeController {
    static readonly LOOP_DELATA = 1000 / 60 // 1s / 60hz
    
    #timePassed = 0
    #isRunning = false;
    #currentValue = 0
    #currentPercentage = 0

    #listeners: CountUpOverTimeListener[] = []

    public readonly VALUE_MAX_LENGTH: number;


    constructor (
        public readonly value: number,
        public readonly duration: number = 1000
    ) {
        this.VALUE_MAX_LENGTH = value.toString().length

        this.setPercentage(0)
    }

    get isRunning() {
        return this.#isRunning
    }
    // set isRunning(value: boolean) {
    //     this.#isRunning = value

    // }

    setPercentage(percentage: number) {
        this.#currentPercentage = percentage
        this.#currentValue = this.value * Math.max(0, Math.min(percentage, 1))

        this.#listeners.forEach(
            l => l(
                this.#currentValue, 
                this.#currentPercentage, 
                this.value
            )
        )

        return this
    }

    listen(callback: CountUpOverTimeListener) {
        this.#listeners.push(callback)

        return this
    }

    reset() {
        this.#timePassed = 0;
        this.#currentValue = 0;

        this.setPercentage(0)

        return this
    }
    start() {
        this.#isRunning = true;
        this.runFrame()
        return this
    }
    stop() {
        this.#isRunning = false;
        return this
    }

    runFrame() {
        if (this.#timePassed > (this.duration + CountUpOverTimeController.LOOP_DELATA)) return this

        
        this.setPercentage(this.#timePassed / this.duration)
        
        this.#timePassed += CountUpOverTimeController.LOOP_DELATA


        
        if (this.#isRunning) {
            // Need to bind "this"
            requestAnimationFrame(this.runFrame.bind(this))
        }

        return this
    }
}

export class TextCountUpOverTimeController {
    public readonly controller: CountUpOverTimeController

    constructor (
        public readonly element: HTMLElement,
        public readonly duration: number = 1000
    ) {
        this.controller = new CountUpOverTimeController(
            parseFloat(element.innerText.replace(".", "").replace(",", ".")),
            duration,
        )


        const listener: CountUpOverTimeListener = (value,) => {
            const valueAsString = value
                .toString()
                .slice(0, this.controller.VALUE_MAX_LENGTH)
                .replace(".", ",")
            
            this.element.innerHTML = valueAsString.endsWith(",")
            ? valueAsString.slice(0, valueAsString.length - 1)
            : valueAsString
        }

        
        this.controller.listen(listener.bind(this))
        
        this.controller.setPercentage(0)
    }

    start() {
        this.controller.start()
        return this
    }

    stop() {
        this.controller.stop()
        return this
    }

    reset() {
        this.controller.reset()
        return this
    }
}