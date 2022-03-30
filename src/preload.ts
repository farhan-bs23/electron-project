// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { ipcRenderer } from "electron";
declare global {
    interface Window {
        isElectron: boolean;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    init();

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(
            `${type}-version`,
            process.versions[type as keyof NodeJS.ProcessVersions],
        );
    }
});

function init() {
    window.isElectron = true;
}
// window.ipcRenderer = ipcRenderer;
