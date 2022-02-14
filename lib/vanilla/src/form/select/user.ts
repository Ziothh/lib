import { addBasicSelect } from "."

export const addUserSelect = (select: HTMLSelectElement) => {
    const customSelect = addBasicSelect(select);

    (customSelect.childNodes as NodeListOf<HTMLDivElement>).forEach(
        option => {
            const p = option.firstElementChild! as HTMLParagraphElement

            // c.style.
            option.classList.add(
                /[aeioAEIO]/.test(p.innerText[0]) ? "an" : "a"
            )
        }
    )
}