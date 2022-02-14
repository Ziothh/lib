export const elementInList = (item, list) => {
    for (const el of list) {
        if (el === item) return true;
    }
    return false;
};
