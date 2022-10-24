export const numberInRange = (number: number, min: number, max: number) => number >= min && number <= max

export type OnChangeFunction<T> = (newValue: T) => void
export type OnChangeOption<T> = OnChangeFunction<T> | undefined

export class NumberCycler {
    private __currentValue: number
    private readonly onChange: OnChangeOption<number>

    public readonly min: number
    public readonly max: number
    private readonly circularCycling: boolean



    constructor(public readonly defaultValue: number, {
        min = 0, 
        max = 10, 
        circularCycling = true, 
        onChange = undefined as OnChangeOption<number>
    } = {}) {
        // Public
        this.min = min
        this.max = max
        this.circularCycling = circularCycling

        // Private 
        this.onChange = onChange
        this.__currentValue = defaultValue
    }

    get currentValue() {
        return this.__currentValue
    }

    private fireOnChange() {
        if (this.onChange !== undefined) this.onChange(this.__currentValue)
    }

    setCurrentValue(value: number) {
        if (numberInRange(value, this.min, this.max)) {
            this.__currentValue = value
        } else {
            throw Error(`min: ${this.min} <= new: ${value} <= max: ${this.max} does not equal to true and "circularCycling" is set to false.`)
        }

        this.fireOnChange()
        return this
    }

    next() {
        const newValue = this.__currentValue + 1 

        if (newValue > this.max && !this.circularCycling) return

        this.__currentValue = newValue > this.max
        ? this.circularCycling
            ? this.min
            : this.__currentValue
        : newValue 

        this.fireOnChange()
        return this
    }
    previous() {
        const newValue = this.__currentValue - 1
        
        if (newValue < this.min && !this.circularCycling) return
        
        this.__currentValue = newValue < this.min
        ? this.circularCycling
            ? this.max
            : this.__currentValue
        : newValue 

        this.fireOnChange()
        return this
    }
}