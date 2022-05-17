export const capitalize = (string: string) => {
    const lower = string.toLowerCase()
    return string.charAt(0).toUpperCase() + lower.slice(1)
}