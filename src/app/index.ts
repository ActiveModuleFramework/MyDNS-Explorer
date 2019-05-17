import * as amf from 'active-module-framework'
import * as electron from 'electron'
import * as path from 'path'

//ActiveModuleFrameworkの設定
new amf.Manager({
	remotePath: '/',										//一般コンテンツのリモートパス
	execPath: '/',											//コマンド実行用リモートパス
	indexPath: path.resolve(__dirname, '../template/index.html'),//index.thmlテンプレート
	rootPath: path.resolve(__dirname,'../public'),				//一般コンテンツのローカルパス
	cssPath: ['css'],										//自動ロード用CSSパス
	jsPath: ['js'],											//一般コンテンツのローカルパス
//	localDBPath: path.resolve(__dirname,'../db/app.db'),	//ローカルDBパス
	localDBPath: path.resolve('app.db'),	//ローカルDBパス(カレントパスに設定)
	modulePath: path.resolve(__dirname,'./modules'),		//モジュール配置パス
	jsPriority: [],											//優先JSファイル設定
	debug: false,											//デバッグ用メッセージ出力
	listen: 58621,											//受付ポート/UNIXドメインソケット
	listened: startElectron,								//初期化完了後コールバック
	//listen:'dist/sock/app.sock'
})

//--------------------------
//Electron用起動設定
function startElectron(port:number|string){
	const app = electron.app
	//Electronで実行されているか確認
	if (app) {
		app.on("window-all-closed", () => {
			if (process.platform != "darwin") {
				app.quit()
			}
		})
		app.on("ready", () => {
			const window = new electron.BrowserWindow({ width: 1280, height: 720, useContentSize: true });
			window.loadURL(`http://localhost:${port}`);
		})
	}
}
