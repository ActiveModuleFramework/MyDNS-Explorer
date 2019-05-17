"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework");
const electron = require("electron");
const path = require("path");
//ActiveModuleFrameworkの設定
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
    listen: 58621,
    listened: startElectron,
});
//--------------------------
//Electron用起動設定
function startElectron(port) {
    const app = electron.app;
    //Electronで実行されているか確認
    if (app) {
        app.on("window-all-closed", () => {
            if (process.platform != "darwin") {
                app.quit();
            }
        });
        app.on("ready", () => {
            const window = new electron.BrowserWindow({ width: 1280, height: 720, useContentSize: true });
            window.loadURL(`http://localhost:${port}`);
        });
    }
}
//# sourceMappingURL=index.js.map