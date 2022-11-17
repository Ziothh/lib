const onScreenEnter = (element: HTMLElement, callback: () => void, delay = 500) => {
    const obs = new IntersectionObserver((entries, observer) => {
        const entry = entries.pop()

        if (!entry) return

        if (entry.isIntersecting) {
            setTimeout(() => {
                callback()

                observer.unobserve(element)
                observer.disconnect()
            }, delay)
        }
    })

    obs.observe(element)
}

export default onScreenEnter