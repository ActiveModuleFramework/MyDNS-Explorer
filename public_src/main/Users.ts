
/// <reference path="../../public/js/jsw.d.ts" />
class UserListWindow extends JSW.Window{
	adapter: JSW.Adapter
	listView : JSW.ListView
	constructor(adapter: JSW.Adapter){
		super({frame:true,overlap:false})
		this.adapter = adapter
		this.setTitle('ユーザリスト(ローカル)')

		const panel = new JSW.Panel()
		this.addChild(panel,'top')

		const addButton = new JSW.Button('追加')
		panel.addChild(addButton,'left')
		addButton.addEventListener('buttonClick',async ()=>{
			const userEditView = new UserEditView()
			const flag = await userEditView.setUser(adapter)
			if(flag){
				this.getUsers()
			}
		})
		const delButton = new JSW.Button('削除')
		panel.addChild(delButton, 'left')
		delButton.addEventListener('buttonClick', () => {
			const values = this.listView.getSelectValues()
			if (values.length){
				const userInfo = values[0]
				const messageBox = new JSW.MessageBox('確認', `[${userInfo.name}]を削除しますか？`, { 'OK': true, 'Cancel': false })
				messageBox.addEventListener('buttonClick', async (value) => {
					if (value)
						if(await this.adapter.exec('Users.delUser', userInfo.no, true)){
							this.getUsers()
						}else{
							new JSW.MessageBox('エラー', `削除失敗`)
						}
				})
			}
		})

		const list = new JSW.ListView()
		this.addChild(list, 'client');
		this.listView = list
		list.addHeader(['NO',['ID',100],'NAME'])
		list.setColumnStyles(['right'])
		list.addEventListener('itemDblClick',async (e)=>{
			const user = list.getItemValue(e.itemIndex) as UserInfo
			const userEditView = new UserEditView()
			const flag = await userEditView.setUser(adapter,
				user.no,user.id,user.name)
			if (flag) {
				this.getUsers()
			}
		})

		this.getUsers()
		this.active()
	}
	async getUsers(){
		const users = await this.adapter.exec('Users.getUsers', true) as UserInfo[]
		if(users){
			const listView = this.listView
			listView.clearItem()
			for(const user of users){
				listView.addItem([user.no,user.id,user.name],user)
			}
		}
		return users

	}


}
class UserEditView extends JSW.FrameWindow{
	textUserID : JSW.TextBox
	textUserPass : JSW.TextBox

	setUser(adapter: JSW.Adapter,no? : number,id? : string,name? : string,pass? : string):Promise<boolean>{
		this.setTitle('ユーザの追加')
		this.setPos()

		this.setPadding(10, 10, 10, 10)

		const textUserID = new JSW.TextBox({
				label: 'ユーザID', text: id || '',
		 		image: './css/images/login_id.svg' })
		this.addChild(textUserID, 'top')
		textUserID.setMargin(0, 0, 0, 10)
		this.textUserID = textUserID


		const textUserName = new JSW.TextBox({
				label: 'ユーザ名(省略時ユーザID)', text: name || '',
				image: './css/images/login_id.svg' })
		this.addChild(textUserName, 'top')
		textUserName.setMargin(0, 0, 0, 10)

		const textUserPass = new JSW.TextBox({
				label: 'パスワード(入力無しは無変更)', type: 'password', text: pass || '',
				image: './css/images/login_pass.svg' })
		textUserPass.setMargin(0, 10, 0, 10)
		this.addChild(textUserPass, 'top')
		this.textUserPass = textUserPass

		const button = new JSW.Button(no?'変更':'追加')
		button.setMargin(0, 10, 0, 5)
		button.setAlign('center')
		this.addChild(button, 'top')

		const msgLabel = new JSW.Label('ユーザの追加')
		msgLabel.setAlign('center')
		this.addChild(msgLabel, 'top')

		return new Promise((resolv)=>{
			button.addEventListener('buttonClick', async () => {
				msgLabel.setText('設定中')
				const info = await adapter.exec('Users.setUser', no?no:0,
					textUserID.getText(), textUserName.getText(), textUserPass.getText(), true)
				if (info) {
					resolv(true)
					msgLabel.setText('設定成功')
					await JSW.Sleep(1000)
					this.close()
				}
				else{
					resolv(false)
					msgLabel.setText('設定失敗')
				}
			})
		})
	}
	getUserId(){
		return this.textUserID.getText()
	}
	getUserPass(){
		return this.textUserPass.getText()
	}

}
class LoginWindow extends JSW.FrameWindow {
	login(adapter: JSW.Adapter,userId? : string,userPass?:string,local?:boolean): Promise<UserInfo> {
		this.setSize(300, 300)
		this.setTitle('ログイン')
		this.setPadding(10, 10, 10, 10)


		const textUserID = new JSW.TextBox({ label: 'ユーザID', image: './css/images/login_id.svg' })
		this.addChild(textUserID, 'top')
		textUserID.setMargin(0, 0, 0, 10)
		if(userId)
			textUserID.setText(userId)

		const textUserPass = new JSW.TextBox({ label: 'パスワード', type: 'password', image: './css/images/login_pass.svg' })
		textUserPass.setMargin(0, 10, 0, 10)
		this.addChild(textUserPass, 'top')
		if(userPass)
			textUserPass.setText(userPass)

		const localCheck = new JSW.CheckBox({ text: "ローカルログイン",checked:true })
		this.addChild(localCheck, 'top')
		if(local)
			localCheck.setCheck(local)

		const keepCheck = new JSW.CheckBox({ text: "ログイン情報の保存" })
		this.addChild(keepCheck, 'top')

		const buttonLogin = new JSW.Button('ログイン')
		buttonLogin.setMargin(0, 10, 0, 5)
		buttonLogin.setAlign('center')
		this.addChild(buttonLogin, 'top')

		const buttonLogout = new JSW.Button('ログアウト')
		buttonLogout.setAlign('center')
		this.addChild(buttonLogout, 'top')

		const msgLabel = new JSW.Label('ログイン入力待ち')
		msgLabel.setAlign('center')
		this.addChild(msgLabel, 'top')

		this.setPos()
		this.active()

		return new Promise((resolv) => {
			this.addEventListener('closed', () => {
				resolv(null)
			})
			buttonLogin.addEventListener('buttonClick', async () => {
				msgLabel.setText('ログイン中')
				const info = await adapter.exec('Users.login',
					textUserID.getText(), textUserPass.getText(),
					localCheck.isCheck(), keepCheck.isCheck())
				if (info) {
					resolv(info)
					msgLabel.setText('認証成功')
					await JSW.Sleep(500)
					this.close()
				}
				else
					msgLabel.setText('ログイン失敗')

			})
			buttonLogout.addEventListener('buttonClick', async () => {
				msgLabel.setText('ログアウト中')
				const info = await adapter.exec('Users.logout')
				if (info) {
					resolv(info)
					msgLabel.setText('ログアウト完了')
					await JSW.Sleep(500)
					this.close()
				}
				else
					msgLabel.setText('ログアウト失敗')

			})
		})
	}
}