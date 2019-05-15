import * as JWF from 'javascript-window-framework'
const USER_SVG = require("./scss/main/user.svg")
const USERS_SVG = require("./scss/main/users.svg")
const DNS_SVG = require("./scss/main/dns.svg")
import { MainView } from './MainView';
import { UserInfo, UserListWindow, UserEditView, LoginWindow } from './Users';
import { MyDNSUserWindow } from './MyDNS';



export class AppManager {
	adapter: JWF.Adapter
	mainWindow: JWF.Window
	mainView:MainView
	topPanel: TopPanel
	userInfo: UserInfo
	loginButton: TopButton
	usersButton: TopButton
	constructor() {
		this.init()
	}
	init() {
		this.adapter = new JWF.Adapter('./')
		this.mainWindow = new JWF.Window()
		this.mainWindow.setOverlap(true)
		this.mainWindow.setMaximize(true)

		this.createPanel()
		this.request();

		const mainView = new MainView(this.adapter)
		this.mainWindow.addChild(mainView,'client')
		this.mainView = mainView

	}
	async request() {
		const user = await this.adapter.exec('Users.request') as UserInfo
		if (user) {
			this.userInfo = user
			this.logined()
		}
		return user
	}
	private logined() {
		this.setUserName(this.userInfo.name)

		if (this.userInfo.no === 0 && this.userInfo.admin) {
			(async () => {
				const userEditView = new UserEditView()
				const flag = await userEditView.setUser(this.adapter, 0, 'admin', 'ローカル管理者')
				if (flag) {
					const user = await this.request()
					if (user.no === -1)
						this.showLoginView(userEditView.getUserId(),userEditView.getUserPass(),true)
				}

			})()
		}
	}
	private async showLoginView(userId?: string, userPass?: string, local?: boolean) {
		const loginView = new LoginWindow()
		const user = await loginView.login(this.adapter, userId, userPass, local)
		if (user) {
			this.userInfo = user
			this.logined()
			this.mainView.update()

		}

	}
	private setUserName(name) {
		this.loginButton.setText(name)
	}
	private createPanel() {
		this.topPanel = new TopPanel()
		this.mainWindow.addChild(this.topPanel, 'top')

		this.loginButton = this.topPanel.createButton(USER_SVG, 'ログイン')
		this.loginButton.
			addEventListener('click', () => {
				this.showLoginView()
			})
		this.usersButton = this.topPanel.createButton(USERS_SVG, 'ローカル\nユーザ管理','ローカル\nユーザ管理')
		this.usersButton.
			addEventListener('click', () => {
				const userListWindow = new UserListWindow(this.adapter)
				userListWindow.setOverlap(false)
				this.mainWindow.addChild(userListWindow, 'client')
			})
		const dnsButton = this.topPanel.createButton(DNS_SVG, 'DNS\nユーザ管理', 'DNS\nユーザ管理')
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
class TopPanel extends JWF.Window{
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
