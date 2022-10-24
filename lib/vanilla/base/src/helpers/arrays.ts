import type {BooleanObject} from "@ziothh/types"
import { NumberCycler, OnChangeOption } from "./numbers"

export const arrayToBoolObject = (array: string[]) => array.reduce(
    (acc, arrElement) => {
        acc[arrElement] = false
        return acc
    }, 
    {} as BooleanObject
)

export class ArrayCycler<T> {
    private readonly numberCycler: NumberCycler

    constructor(public readonly array: T[], {
        defaultIndex = 0,
        circularCycling = true,
        onChange = undefined as OnChangeOption<T>
    } = {}) {
        this.numberCycler = new NumberCycler(defaultIndex, {
            min: 0,
            max: array.length - 1,
            onChange: (index) => {if (onChange) onChange(array[index])},
            circularCycling
        })
    }

    get currentIndex() {
        return this.numberCycler.currentValue
    }

    get currentValue() {
        return this.array[this.currentIndex]
    }

    get isFirstIndex() {
        return this.currentIndex === 0
    }
    get isLastIndex() {
        return this.currentIndex === this.array.length - 1
    }

    previous() {
        this.numberCycler.previous()
        return this
    }
    next() {
        this.numberCycler.next()
        return this
    }

    setCurrentIndex(index: number) {
        this.numberCycler.setCurrentValue(index)
        return this
    }
}