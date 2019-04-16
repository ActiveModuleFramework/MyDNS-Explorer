//SOCK_PORTを0にするとUNIXドメインソケットが有効になる
let SOCK_PATH = 'sock/app.sock.'
let SOCK_PORT = 8000

import * as fs from 'fs'
import * as express from 'express'
import { Manager } from 'active-module-framework/Manager'
import { BaseHtml } from 'active-module-framework/BaseHtml'
class Main {
	manager = new Manager()
	app = express()
	sockPort: number
	sockPath: string

	/**
	 *Creates an instance of Main.
	 * @memberof Main
	 */
	constructor() {
		this.init()
	}

	/**
	 *前回のソケットファイルの削除
	 *
	 * @memberof Main
	 */
	removeSock() {
		if (!SOCK_PORT) {
			try {
				fs.unlinkSync(this.sockPath);
			} catch (e) { }
		}
	}
	/**
	 *初期化処理
	 *
	 * @memberof Main
	 */
	async init() {
		if (SOCK_PORT) {
			this.sockPort = SOCK_PORT + parseInt(process.env.NODE_APP_INSTANCE || '0')
		}
		else {
			this.sockPath = SOCK_PATH + (process.env.NODE_APP_INSTANCE || '0')
		}

		//終了時の処理(Windowsでは動作しない)
		process.on('SIGINT', onExit);
		process.on('SIGTERM', onExit);
		async function onExit(code) {
			await this.manager.destory();
			this.removeSock();	//ソケットファイルの削除
			process.exit(code);
		}
		//ディレクトリとファイルの初期化
		await this.initPath()
		//ソケットの待ち受け
		this.listen()
	}
	/**
	 *初期ディレクトリやファイルの設定
	 *
	 * @memberof Main
	 */
	async initPath() {
		// webフォルダの中身を公開する(Nginxにroot設定を入れている場合は不要)
		this.app.use("/", express.static('public'));

		this.manager.setExpress(this.app, '/')
		await this.manager.init('db/app.db', 'app/modules')

		this.app.all('/', function (req, res) {
			BaseHtml.output(res, ['public/css'], ['public/js'], ['jsw.js'])
		})
	}
	//待ち受け設定
	listen() {
		if (SOCK_PORT) {
			this.app.listen(this.sockPort)		//ソケットの待ち受け設定
			console.log('localhost:%d', this.sockPort)
		} else {
			this.removeSock()					//ソケットファイルの削除
			this.app.listen(this.sockPath)		//ソケットの待ち受け設定
			console.log(this.sockPath)
			try {
				fs.chmodSync(this.sockPath, '666')	//ドメインソケットのアクセス権を設定
			} catch (e) { }
		}
	}

}

new Main()
