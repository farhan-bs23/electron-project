// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

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
    console.log(inputUrlElem.value);
});

inputUrlElem.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addItem.click();
    }
});
