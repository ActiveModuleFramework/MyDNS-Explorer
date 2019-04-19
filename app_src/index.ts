import * as amf from 'active-module-framework/Manager'

const params : amf.ManagerParams = {
	remotePath: '/',			//一般コンテンツのリモートパス
	execPath: '/',				//コマンド実行用リモートパス
	rootPath: 'public',			//一般コンテンツのローカルパス
	cssPath: ['css'],			//自動ロード用CSSパス
	jsPath: ['js'],				//一般コンテンツのローカルパス
	localDBPath: 'db/app.db',	//ローカルDBパス
	modulePath: 'app/modules',	//モジュール配置パス
	jsPriority: ['jsw.js'],		//優先JSファイル設定
	debug: true,				//デバッグ用メッセージ出力
	listen: 8000				//受付ポート/UNIXドメインソケット
	//listen:'sock/app.sock'
}
new amf.Manager(params)
