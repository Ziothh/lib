export const addTogglePwd = () => {
    const states = {
        hide: {
            faClass: "fa-eye",
            title: "show password",
            inputType: "password",
        },
        show: {
            faClass: "fa-eye-slash",
            title: "hide password",
            inputType: "text",
        },
    };

    const setState = (toggleIcon, pwdInput, showing) => {
        const oldState = showing ? states.hide : states.show;
        const newState = showing ? states.show : states.hide;

        toggleIcon.classList.remove(oldState.faClass);
        toggleIcon.classList.add(newState.faClass);
        toggleIcon.setAttribute("title", newState.title);
        toggleIcon.setAttribute("showing", showing);
        pwdInput.setAttribute("type", newState.inputType);
    };

    const togglePwdVisibility = (toggleIcon, pwdInput) => {
        setState(
            toggleIcon,
            pwdInput,
            !JSON.parse(toggleIcon.getAttribute("showing"))
        );
    };

    document.querySelectorAll("input[type='password']").forEach((input) => {
        const toggleIcon: HTMLElement = input!.parentElement!.querySelector("i.pwd-visibility-toggle")!;
        toggleIcon.classList.add("fa") // just to be sure
        setState(toggleIcon, input, false) // initial state
        toggleIcon.onclick = () => togglePwdVisibility(toggleIcon, input);
    });
};