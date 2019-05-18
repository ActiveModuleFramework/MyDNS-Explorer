import * as amf from 'active-module-framework'
import * as electron from 'electron'
import * as path from 'path'

const listenPort = 58621

/**
 * Electron用起動設定
 */
const app = electron.app
let window: electron.BrowserWindow|null = null
//Electronで実行されているかとUNIXドメインソケットを使用していないか確認
if (app) {
	//ウインドウが閉じられた場合の処理
	app.on("window-all-closed", async () => {
		if (process.platform != "darwin") {
			await manager.destory() //バックエンド処理を終了させる
			app.quit()				//アプリケーション終了
		}
	})
	//ウインドウ表示処理
	const init = () => {
		window = new electron.BrowserWindow({ width: 1280, height: 720, autoHideMenuBar: true })
		//起動メッセージの表示
		window.loadURL(`file://${path.resolve(__dirname,'../template/electron.html')}`)
	}

	if (app.isReady()) {
		init()
	} else {
		app.once("ready", () => {
			init()
		})
	}
}


/**
 * バックエンドが準備完了になった場合の処理
 */
const listened = (port: number | string|null)=> {
	if (window){
		if (port === null){
			//ポート使用中のエラー表示
			window.loadURL(`file://${path.resolve(__dirname, '../template/electron.html')}?cmd=error&port=${listenPort}`)
		}
		else if(typeof port === 'number'){
			window.loadURL(`http://localhost:${port}`)
		}
	}
}


/**
 * バックエンドの設定
 */
const manager = new amf.Manager({
	remotePath: '/',										//一般コンテンツのリモートパス
	execPath: '/',											//コマンド実行用リモートパス
	indexPath: path.resolve(__dirname, '../template/index.html'),//index.thmlテンプレート
	rootPath: path.resolve(__dirname, '../public'),			//一般コンテンツのローカルパス
	cssPath: ['css'],										//自動ロード用CSSパス
	jsPath: ['js'],											//一般コンテンツのローカルパス
	localDBPath: path.resolve(__dirname,'../db/app.db'),	//ローカルDBパス
	//localDBPath: path.resolve('app.db'),	//ローカルDBパス(カレントパスに設定)
	modulePath: path.resolve(__dirname, './modules'),		//モジュール配置パス
	jsPriority: [],											//優先JSファイル設定
	debug: false,											//デバッグ用メッセージ出力
	listened,												//初期化完了後コールバック
	//listen: listenPort									//受付ポート/UNIXドメインソケット
	listen: path.resolve(__dirname, '../sock/app.sock')		//UNIXドメインソケットを使用する場合
})
