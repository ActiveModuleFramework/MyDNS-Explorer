"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework");
const electron = require("electron");
const path = require("path");
const listenPort = 58621;
/**
 * Electron用起動設定
 */
const app = electron.app;
let window = null;
//Electronで実行されているかとUNIXドメインソケットを使用していないか確認
if (app) {
    //ウインドウが閉じられた場合の処理
    app.on("window-all-closed", async () => {
        if (process.platform != "darwin") {
            await manager.destory(); //バックエンド処理を終了させる
            app.quit(); //アプリケーション終了
        }
    });
    //ウインドウ表示処理
    const init = () => {
        window = new electron.BrowserWindow({
            width: 1280,
            height: 720,
            autoHideMenuBar: true
        });
        //起動メッセージの表示
        window.loadURL(`file://${path.resolve(__dirname, "../template/electron.html")}`);
    };
    //準備完了時に初期化
    if (app.isReady()) {
        init();
    }
    else {
        app.once("ready", () => {
            init();
        });
    }
}
/**
 * バックエンドが準備完了になった場合の処理
 */
const listened = (port) => {
    if (window) {
        if (port === null) {
            //ポート使用中のエラー表示
            window.loadURL(`file://${path.resolve(__dirname, "../template/electron.html")}?cmd=error&port=${listenPort}`);
        }
        else if (typeof port === "number") {
            window.loadURL(`http://localhost:${port}`);
        }
    }
};
/**
 * バックエンドの設定
 */
const manager = new amf.Manager({
    remotePath: "/",
    execPath: "/",
    indexPath: path.resolve(__dirname, "../template/index.html"),
    rootPath: path.resolve(__dirname, "../public"),
    cssPath: ["css"],
    jsPath: ["js"],
    localDBPath: path.resolve(__dirname, '../db/app.db'),
    //localDBPath: path.resolve("app.db"), //ローカルDBパス(カレントパスに設定)
    modulePath: path.resolve(__dirname, "./modules"),
    jsPriority: [],
    debug: false,
    listened,
    //listen: listenPort //受付ポート/UNIXドメインソケット
    listen: path.resolve(__dirname, '../sock/app.sock') //UNIXドメインソケットを使用する場合
});
//# sourceMappingURL=index.js.map