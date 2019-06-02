import * as JWF from 'javascript-window-framework'
import * as MyDNS from './MyDNS'

/**
 *メインビュー表示用クラス
 *
 * @export
 * @class MainView
 * @extends {JWF.Window}
 */
export class MainView extends JWF.Window{
	adapter: JWF.Adapter
	treeView : JWF.TreeView
	listView : JWF.ListView
	constructor(adapter: JWF.Adapter){
		super()
		this.adapter = adapter

		//分割バーの作成
		const split = new JWF.Splitter()
		this.addChild(split,'client')

		//ツリービュー上部のパネル作成
		const panel = new JWF.Panel()
		split.addChild(0, panel, 'top')
		const button = new JWF.Button('表示更新')
		panel.addChild(button, 'left')
		button.addEventListener('buttonClick',()=>{this.update()})
		const button2 = new JWF.Button('データ更新')
		panel.addChild(button2, 'left')
		button2.addEventListener('buttonClick', async () => {
			const msgBox = new JWF.MessageBox('データ更新','更新中')
			if(await adapter.exec('MyDNS.update')){
				msgBox.close()
				this.update()
			}else{
				msgBox.setText('更新失敗')
			}

		})

		//ツリービューの作成
		const tree = new JWF.TreeView()
		this.treeView = tree
		split.addChild(0,tree,'client')
		split.setSplitterPos(300)
		split.setOverlay(true,400)
		tree.addEventListener('itemSelect',(e)=>{this.outputInfo(e.item.getItemValue() as [string, MyDNS.MyDNSInfo])})
		tree.addEventListener('itemDblClick', async (e) => {
			const item = e.item
			const id = (item.getItemValue() as string[])[0]
			const result = await this.adapter.exec('MyDNS.getPassword',id) as {pass:string}
			if (result){
				//MyDNSに遷移して自動ログインするための処理
				const win = window.open('','_blank')
        if(!win)
          return;
				win.document.open()
				win.document.write(
				`<html><body>
				<form name='mydns' action='https://www.mydns.jp' method='post'>
				<input type='hidden' name='masterid' value='${id}'>
				<input type='hidden' name='masterpwd' value='${result.pass}'>
				<input type='hidden' name='MENU' value='100'>
				</form>
				<script>document.mydns.submit()</script>`)
				win.document.close()
			}
		 })

		 //リストビューの作成
		const list = new JWF.ListView()
		this.listView = list
		split.addChild(1,list,'client')
		list.addHeader(['項目',['DATA1',200],['DATA2',150],'DATA3'])

		this.update()
	}
	/**
	 *表示更新
	 *
	 * @memberof MainView
	 */
	async update() {
		const results = await this.adapter.exec('MyDNS.getUsers') as  {[key: string]: unknown}[]

		//IDごとに情報を展開
		const infos: { [keys: string]: MyDNS.MyDNSInfo} = {}
		if (results) {
			for(const result of results){
				const info = result.info as MyDNS.MyDNSInfo
				infos[result.id as string] = info
			}
		}
		const topInfos: { [keys: string]: MyDNS.MyDNSInfo } = {}
		for(const key in infos){
			const pid = this.getDNSParent(infos,key)
			if(pid === null)
				topInfos[key] = infos[key]
		}

		const treeView = this.treeView
		treeView.clearItem()
		treeView.getRootItem().setItemText('DNS Tree')
		for (const key in topInfos) {
			const info = topInfos[key]
			const item = treeView.addItem(`${info.domainInfo.domainname} (${key})`,true)
			item.setItemValue([key,info])
			this.addTreeChild(item,info,infos)
		}
		this.listView.clearItem()
	}
	/**
	 *MyDNSの親IDを返す
	 *
	 * @private
	 * @param {{ [keys: string]: MyDNS.MyDNSInfo }} infos
	 * @param {string} id
	 * @returns
	 * @memberof MainView
	 */
	private getDNSParent(infos: { [keys: string]: MyDNS.MyDNSInfo },id:string){
		for (const key in infos) {
			const info = infos[key]
			const childInfo = info.childInfo
			for(const cid of childInfo.masterid){
				if(id === cid)
					return key
			}
		}
		return null
	}
	/**
	 *ツリービューに情報を追加
	 *
	 * @private
	 * @param {JWF.TreeItem} item
	 * @param {*} info
	 * @param {{ [keys: string]: MyDNS.MyDNSInfo }} infos
	 * @memberof MainView
	 */
	private addTreeChild(item: JWF.TreeItem, info:MyDNS.MyDNSInfo, infos: { [keys: string]: MyDNS.MyDNSInfo }){
		const childInfo = info.childInfo
		for (const cid of childInfo.masterid) {
			const cinfo = infos[cid]
			if(cinfo){
				const citem = item.addItem(`${cinfo.domainInfo.domainname} (${cid})`,true)
				citem.setItemValue([cid,cinfo])
				this.addTreeChild(citem,cinfo,infos)
			}
		}
	}
	/**
	 *リストビューに情報を表示
	 *
	 * @param {*} value
	 * @memberof MainView
	 */
	outputInfo(value : [string,MyDNS.MyDNSInfo]){
		if (!value)
			return
		const id = value[0]
		const info = value[1]
		const domainInfo = info.domainInfo
		//const childInfo = info.childInfo
		const listView = this.listView
		listView.clearItem()

		listView.addItem(['ID',id])
		listView.addItem(['UPDATE', (new Date(domainInfo.update)).toLocaleString()])
		listView.addItem(['IPv4', domainInfo.ipV4])
		listView.addItem(['IPv6', domainInfo.ipV6])
		listView.addItem(['DOMAIN', domainInfo.domainname])
		for(const index in domainInfo.mx){
			if (domainInfo.mx[index])
				listView.addItem(['RECORD', domainInfo.mx[index],'MX',domainInfo.prio[index]])
		}
		for(const index in domainInfo.type){
			if (domainInfo.hostname[index])
				listView.addItem(['RECORD', domainInfo.hostname[index], domainInfo.type[index], domainInfo.content[index] || domainInfo.delegateid[index]])
		}
	}

}