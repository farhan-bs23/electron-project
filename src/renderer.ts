import { windowItem, ipcItem } from "./model";

//DOM element references
const showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    addItem = document.getElementById("add-item"),
    inputUrlElem = document.getElementById("url") as HTMLInputElement,
    searchElem = document.getElementById("search") as HTMLInputElement,
    modal = document.getElementById("modal");

//show modal
showModal.addEventListener("click", () => {
    modal.style.display = "flex";
    addItem.removeAttribute("disabled");
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
        addItem.setAttribute("disabled", "");
        window.electronAPI.addItem(value);
    }
});

//search items
searchElem.addEventListener("keyup", (event) => {
    const data: windowItem[] = getLocalData();
    const { value } = searchElem;
    const newList = data.filter((item) => {
        return item.title.toLowerCase().includes(value.toLowerCase());
    });
    displayItems(newList);
});

inputUrlElem.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addItem.click();
    }
});

window.electronAPI.itemCb((value: ipcItem) => {
    addItem.removeAttribute("disabled");
    if (value.success) {
        addToLocal(value);
        closeModal.click();
    } else {
        alert(`lol that's not a valid url.`);
    }
});

function addToLocal(item: ipcItem) {
    const localData = getLocalData();
    localData.push(item);
    localStorage.setItem("urldata", JSON.stringify(localData));
    displayItems(localData);
}

function displayItems(list: windowItem[]) {
    const items = document.getElementById("items");
    items.innerHTML = "";
    list.forEach((item, index) => {
        const itemNode = document.createElement("div");
        itemNode.setAttribute("class", "item");
        itemNode.innerHTML = `
            <img src="${item.screenshot}" onclick="openWindow(this, '${item.url}')">
            <h3>${item.title}</h3>
            <h6 onclick="deleteItem(this, ${index})">Delete<h6>
        `;
        items.appendChild(itemNode);
    });
}

function openWindow(elem: HTMLElement, url: string) {
    window.electronAPI.openURL(url);
}

function deleteItem(elem: HTMLElement, index: number) {
    const localData: windowItem[] = getLocalData();
    const newList = localData.filter((item, ind) => {
        return index !== ind;
    });
    localStorage.setItem("urldata", JSON.stringify(newList));
    displayItems(newList);
}

function getLocalData() {
    return localStorage.getItem("urldata")
        ? JSON.parse(localStorage.getItem("urldata"))
        : [];
}

function init() {
    const data: windowItem[] = getLocalData();
    displayItems(data);
}

init();
