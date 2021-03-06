import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { ipcItem } from "./model";

ipcMain.on("add-item", (event, value) => {
    createOffscreen(value, (res: ipcItem) => {
        event.sender.send("add-item-ret", res);
    });
});

ipcMain.on("open-item", (event, value) => {
    createURLWindow(value);
});

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        height: 800,
        width: 1000,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

function createURLWindow(url: string) {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        height: 500,
        width: 500,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// function to get urls screenshot & title
async function createOffscreen(url: string, callback: Function) {
    const offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
        },
    });
    offscreenWindow.webContents.on("did-finish-load", () => {
        const title = offscreenWindow.getTitle();
        offscreenWindow.webContents
            .capturePage()
            .then((value) => {
                const screenshot = value.toDataURL();
                callback({ success: true, title, screenshot, url });
            })
            .catch(() => {
                callback({ success: false });
            });
        offscreenWindow.close();
    });
    offscreenWindow.loadURL(url).catch(() => {
        callback({ success: false });
    });
}
