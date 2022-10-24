const countUpOverTime = (
    element: HTMLElement, 
    duration: number = 1000
) => new Promise((res) => {
    let timePassed = 0
    const loopDelta = 1000 / 60 // 1s / 60hz

    const value = parseFloat(element.innerText.replace(",", "."))
    const maxLength = element.innerText.length

    const loop = () => {
        if (timePassed > duration + loopDelta) return res(undefined)

        
        const percentage = timePassed / duration

        const valueAsString = `${
            value * Math.min(percentage, 1)
        }`.slice(0, maxLength).replace(".", ",")
        
        element.innerHTML = valueAsString.endsWith(",")
        ? valueAsString.slice(0, valueAsString.length - 1)
        : valueAsString

        
        
        timePassed += loopDelta
        requestAnimationFrame(loop)
    }

    loop()
})

export default countUpOverTime