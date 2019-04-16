class MyDNSEditWindow extends JSW.FrameWindow {

	enter(adapter: JSW.Adapter) {
		this.setSize(300, 200)
		this.setTitle('MyDNS ユーザの追加')
		this.setPadding(10, 10, 10, 10)


		const textUserID = new JSW.TextBox({ label: 'ユーザID', image: './css/images/login_id.svg' })
		this.addChild(textUserID, 'top')
		textUserID.setMargin(0, 0, 0, 10)

		const textUserPass = new JSW.TextBox({ label: 'パスワード', type: 'password', image: './css/images/login_pass.svg' })
		textUserPass.setMargin(0, 10, 0, 10)
		this.addChild(textUserPass, 'top')

		const addLogin = new JSW.Button('追加')
		addLogin.setMargin(0, 10, 0, 5)
		addLogin.setAlign('center')
		this.addChild(addLogin, 'top')

		const msgLabel = new JSW.Label('入力待ち')
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
					textUserID.getText(), textUserPass.getText())
				if (info) {
					resolv(info)
					msgLabel.setText('追加成功')
					await JSW.Sleep(500)
					this.close()
				}
				else
					msgLabel.setText('追加失敗')

			})
		})
	}
}

interface MyDNSDomainInfo {
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
interface MyDNSChildInfo {
	masterid: string[]
	domainname: string[]
	ipv4addr: string[]
	ipv6addr: string[]
	iplastdate: string[]
}
interface MyDNSInfo {
	domainInfo: MyDNSDomainInfo
	childInfo: MyDNSChildInfo
}

class MyDNSUserWindow extends JSW.Window{
	listView : JSW.ListView
	adapter : JSW.Adapter
	constructor(adapter:JSW.Adapter){
		super({frame:true,overlap:false})
		this.adapter = adapter

		this.setTitle('DNSユーザ管理')
		const panel = new JSW.Panel()
		this.addChild(panel,'top')
		const addButton = new JSW.Button('追加','add')
		panel.addChild(addButton,'left')
		const delButton = new JSW.Button('削除','del')
		panel.addChild(delButton, 'left')
		const listView = new JSW.ListView()
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
				const userInfo = values[0]
				const messageBox = new JSW.MessageBox('確認', `[${userInfo.id}]を削除しますか？`, { 'OK': true, 'Cancel': false })
				messageBox.addEventListener('buttonClick', async (value) => {
					if (value)
						if (await this.adapter.exec('MyDNS.delUser', userInfo.id)) {
							this.update()
						} else {
							new JSW.MessageBox('エラー', `削除失敗`)
						}
				})
			}
		})


		this.update()
		this.active()

	}
	async update(){
		const results = await this.adapter.exec('MyDNS.getUsers')
		if(results){
			const listView = this.listView
			listView.clearItem()
			for(const result of results){
				const info = result.info as MyDNSInfo
				const update = info.domainInfo.update?(new Date(info.domainInfo.update)).toLocaleString():''
				listView.addItem([result.id, update, info.domainInfo.ipV4,info.domainInfo.domainname],result)
			}
		}
	}
}