
interface UserInfo {
	no: number
	type: string
	id: string
	name: string
	admin: boolean
}

class AppManager {
	adapter: JSW.Adapter
	mainWindow: JSW.Window
	topPanel: TopPanel
	userInfo: UserInfo
	loginButton: TopButton
	usersButton: TopButton
	constructor() {
		this.init()
	}
	init() {
		this.adapter = new JSW.Adapter('./')
		this.mainWindow = new JSW.Window()
		//this.mainWindow.setAnimation
		this.mainWindow.setOverlap(true)
		this.mainWindow.setMaximize(true)

		this.createPanel()
		this.request();

		const mainView = new MainView(this.adapter)
		this.mainWindow.addChild(mainView,'client')

	}
	async request() {
		const user = await this.adapter.exec('Users.request') as UserInfo
		if (user) {
			this.userInfo = user
			this.login()
		}
		return user
	}
	private login() {
		this.setUserName(this.userInfo.name)

		if (this.userInfo.no === 0 && this.userInfo.admin) {
			(async () => {
				const userEditView = new UserEditView()
				const flag = await userEditView.setUser(this.adapter, 0, 'admin', 'ローカル管理者')
				if (flag) {
					const user = await this.request()
					if (user.no === -1)
						this.showLoginView()
				}

			})()
		}
	}
	private async showLoginView() {
		const loginView = new LoginWindow()
		const user = await loginView.login(this.adapter)
		if (user) {
			this.userInfo = user
			this.login()
		}

	}
	private setUserName(name) {
		this.loginButton.setText(name)
	}
	private createPanel() {
		this.topPanel = new TopPanel()
		this.mainWindow.addChild(this.topPanel, 'top')

		this.loginButton = this.topPanel.createButton('./css/main/user.svg', 'ログイン')
		this.loginButton.
			addEventListener('click', () => {
				this.showLoginView()
			})
		this.usersButton = this.topPanel.createButton('./css/main/users.svg', 'ローカル\nユーザ管理','ローカル\nユーザ管理')
		this.usersButton.
			addEventListener('click', () => {
				const userListWindow = new UserListWindow(this.adapter)
				userListWindow.setOverlap(false)
				this.mainWindow.addChild(userListWindow, 'client')
			})
		const dnsButton = this.topPanel.createButton('./css/main/dns.svg', 'DNS\nユーザ管理', 'DNS\nユーザ管理')
		dnsButton.
			addEventListener('click', () => {
				const dnsUserWindow = new MyDNSUserWindow(this.adapter)
				this.mainWindow.addChild(dnsUserWindow, 'client')
			})

	}
}
interface TopButton extends HTMLDivElement{
	setText(text:string):void
}
class TopPanel extends JSW.Window{
	constructor(){
		super()
		this.setHeight(80)
		const client = this.getClient()
		client.dataset.style = 'TOP'
	}
	createButton(imageURL:string,title:string,text?:string){
		var buttonNode = document.createElement('div') as TopButton
		var imageNode = document.createElement('img')
		var textNode = document.createElement('div')
		buttonNode.appendChild(imageNode)
		buttonNode.appendChild(textNode)
		imageNode.src = imageURL
		imageNode.title = title
		if (text)
			textNode.innerText = text

		buttonNode.setText = (text:string)=>{
			textNode.innerText = text
		}
		this.getClient().appendChild(buttonNode)

		return buttonNode
	}
}
