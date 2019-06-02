import * as JWF from 'javascript-window-framework'
import { UserInfo } from './Users';
const LOGIN_ID_SVG = require("./scss/main/login_id.svg")
const LOGIN_PASS_SVG = require("./scss/main/login_pass.svg")

/**
 *MyDNSのユーザ管理用ウインドウクラス
 *
 * @export
 * @class MyDNSEditWindow
 * @extends {JWF.FrameWindow}
 */
export class MyDNSEditWindow extends JWF.FrameWindow {

	enter(adapter: JWF.Adapter) {
		this.setSize(300, 200)
		this.setTitle('MyDNS ユーザの追加')
		this.setPadding(10, 10, 10, 10)


		const textUserID = new JWF.TextBox({ label: 'ユーザID', image: LOGIN_ID_SVG })
		this.addChild(textUserID, 'top')
		textUserID.setMargin(0, 0, 0, 10)

		const textUserPass = new JWF.TextBox({ label: 'パスワード', type: 'password', image: LOGIN_PASS_SVG })
		textUserPass.setMargin(0, 10, 0, 10)
		this.addChild(textUserPass, 'top')

		const addLogin = new JWF.Button('追加')
		addLogin.setMargin(0, 10, 0, 5)
		addLogin.setAlign('center')
		this.addChild(addLogin, 'top')

		const msgLabel = new JWF.Label('入力待ち')
		msgLabel.setAlign('center')
		this.addChild(msgLabel, 'top')

		this.setPos()
		this.active()

		return new Promise((resolv) => {
			this.addEventListener('closed', () => {
				resolv(null)
			})
			addLogin.addEventListener('buttonClick', async () => {
				msgLabel.setText('ID確認中')
				const info = await adapter.exec('MyDNS.addUser',
					textUserID.getText(), textUserPass.getText()) as {}
				if (info) {
					resolv(info)
					msgLabel.setText('追加成功')
					await JWF.Sleep(500)
					this.close()
				}
				else
					msgLabel.setText('追加失敗')

			})
		})
	}
}

export interface MyDNSDomainInfo {
	domainname: string
	update: string
	ipV4: string
	ipV6: string
	mx: string[]
	prio: number[]
	hostname: string[]
	type: string[]
	content: string[]
	delegateid: string[]
}
export interface MyDNSChildInfo {
	masterid: string[]
	domainname: string[]
	ipv4addr: string[]
	ipv6addr: string[]
	iplastdate: string[]
}
export interface MyDNSInfo {
	domainInfo: MyDNSDomainInfo
	childInfo: MyDNSChildInfo
}

/**
 *MyDNSのユーザ編集用クラス
 *
 * @export
 * @class MyDNSUserWindow
 * @extends {JWF.Window}
 */
export class MyDNSUserWindow extends JWF.Window{
	listView : JWF.ListView
	adapter : JWF.Adapter
	constructor(adapter:JWF.Adapter){
		super({frame:true,overlap:false})
		this.adapter = adapter

		this.setTitle('DNSユーザ管理')
		const panel = new JWF.Panel()
		this.addChild(panel,'top')
		const addButton = new JWF.Button('追加','add')
		panel.addChild(addButton,'left')
		const delButton = new JWF.Button('削除','del')
		panel.addChild(delButton, 'left')
		const listView = new JWF.ListView()
		this.listView = listView
		this.addChild(listView,'client')
		listView.addHeader([['ID',150],['UPDATE',200],['IP',150],'DOMAIN']);

		addButton.addEventListener('buttonClick', async () => {
			const userEditView = new MyDNSEditWindow()
			const flag = await userEditView.enter(adapter)
			if (flag) {
				this.update()
			}
		})
		delButton.addEventListener('buttonClick', () => {
			const values = this.listView.getSelectValues()
			if (values.length) {
				const userInfo = values[0] as UserInfo;
				const messageBox = new JWF.MessageBox('確認', `[${userInfo.id}]を削除しますか？`, { 'OK': true, 'Cancel': false })
				messageBox.addEventListener('buttonClick', async (value) => {
					if (value)
						if (await this.adapter.exec('MyDNS.delUser', userInfo.id)) {
							this.update()
						} else {
							new JWF.MessageBox('エラー', `削除失敗`)
						}
				})
			}
		})


		this.update()
		this.active()

	}
	/**
	 *表示更新
	 *
	 * @memberof MyDNSUserWindow
	 */
	async update(){
		const results = await this.adapter.exec('MyDNS.getUsers') as {[key: string]: unknown}[]
		if(results){
			const listView = this.listView
			listView.clearItem()
			for(const result of results){
				const info = result.info as {domainInfo:{update:string,ipV4:string,domainname:string}}
				const update = info.domainInfo.update?(new Date(info.domainInfo.update)).toLocaleString():''
				listView.addItem([result.id as string, update, info.domainInfo.ipV4,info.domainInfo.domainname],result)
			}
		}
	}
}