//DOM element references
const showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    addItem = document.getElementById("add-item"),
    inputUrlElem = document.getElementById("url") as HTMLInputElement,
    modal = document.getElementById("modal");

//show modal
showModal.addEventListener("click", () => {
    modal.style.display = "flex";
    inputUrlElem.focus();
});

//hide modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

//add to list
addItem.addEventListener("click", () => {
    const { value } = inputUrlElem;
    if (value) {
        console.log(value);
        window.electronAPI.addItem(value);
    }
});

inputUrlElem.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addItem.click();
    }
});

window.electronAPI.itemCb((value: string) => {
    console.log(value);
});
