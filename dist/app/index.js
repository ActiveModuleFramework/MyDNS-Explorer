"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework");
const path = require("path");
const port = 58621;
new amf.Manager({
    remotePath: '/',
    execPath: '/',
    indexPath: path.resolve(__dirname, '../template/index.html'),
    rootPath: path.resolve(__dirname, '../public'),
    cssPath: ['css'],
    jsPath: ['js'],
    //	localDBPath: path.resolve(__dirname,'../db/app.db'),	//ローカルDBパス
    localDBPath: path.resolve('app.db'),
    modulePath: path.resolve(__dirname, './modules'),
    jsPriority: [],
    debug: false,
    listen: port //受付ポート/UNIXドメインソケット
    //listen:'dist/sock/app.sock'
});
const electron = require("electron");
const app = electron.app;
if (app) {
    const BrowserWindow = electron.BrowserWindow;
    let mainWindow = null;
    app.on("window-all-closed", () => {
        if (process.platform != "darwin") {
            app.quit();
        }
    });
    app.on("ready", () => {
        mainWindow = new BrowserWindow({ width: 1280, height: 720, useContentSize: true });
        mainWindow.loadURL(`http://localhost:${port}`);
        mainWindow.on("closed", () => {
            mainWindow = null;
        });
    });
}
//# sourceMappingURL=index.js.map