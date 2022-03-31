// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { ipcRenderer, contextBridge } from "electron";

declare global {
    interface Window {
        electronAPI: {
            addItem: (b: string) => void;
            itemCb: Function;
        };
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(
            `${type}-version`,
            process.versions[type as keyof NodeJS.ProcessVersions],
        );
    }
});

contextBridge.exposeInMainWorld("electronAPI", {
    addItem: (title: string) => {
        ipcRenderer.send("add-item", title);
    },
    itemCb: (callback: Function) => {
        ipcRenderer.on("add-item-ret", (e, value) => {
            callback(value);
        });
    },
});
