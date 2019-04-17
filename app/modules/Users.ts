import * as crypto from 'crypto'
import {Module} from 'active-module-framework/Module'

function getSHA256(v1:string,v2?:string) : string{
	return crypto.createHash('sha256').update(v1+(v2?v2:'')).digest('hex');
}
interface UserInfo{
	no: number
	type: string
	id: string
	name: string
	admin: boolean
}

export class Users extends Module{
	userInfo : UserInfo

	static async onCreateModule():Promise<boolean>{
		const localDB = Module.getLocalDB()
		//localDB.db.run('drop table users');
		localDB.run(
			'CREATE TABLE IF NOT EXISTS users (users_no integer primary key,users_enable boolean,\
			users_id TEXT,users_password TEXT,users_name TEXT,users_info JSON,UNIQUE(users_id))')

		return true;
	}
	private static async getLocalCount() {
		const localDB = Module.getLocalDB()
		const result = await localDB.get("select count(*) as count from users where users_enable=1")
		return result.count
	}
	async onStartSession(){
		var count = await Users.getLocalCount()
		let user: UserInfo = null

		if (count === 0) {
			//ローカルユーザが存在しなければ管理者に設定
			user = { no: 0, type: 'local', id: 'Admin', name: '暫定管理者', admin: true }
		} else {
			//セッションユーザの確認
			user = this.getSessionItem('user')
			if (user){
				if (user.no === 0)
					user = null //暫定管理者なら情報をクリア
				else //ユーザナンバーからユーザ情報を再設定
					user = await Users.getUserInfoFromNo(user.no, user.type === 'local')
			}else{
				//セッションに情報が無かった場合、グローバルログインを確認
				user = this.getGlobalItem('user')
				if(user)
					this.setSessionItem('user', user)
			}

		}
		//ユーザが存在しなければゲスト扱い
		if(!user)
			user = this.logout()
		this.userInfo = user

		Module.output('ユーザ: %s', JSON.stringify(this.userInfo) )
	}
	async isLogin(userId, userPass, local){
		const localDB = Module.getManager().getLocalDB()
		if (local) {
			var result = await localDB.get("select 0 from users where users_id=? and users_password=? and users_enable=1", userId, getSHA256(userPass))
			if (!result)
				return false;
			return true
		}
		return false;
	}
	static async getUserInfoFromNo(no, local): Promise<UserInfo> {
		if (local) {
			const localDB = Users.getLocalDB()
			var result = await localDB.get("select users_no as no,users_id as id,users_name as name,'local' as type,true as admin from users where users_no=? ", no)
			if (result)
				return result as UserInfo;
		}
		return null
	}
	static async getUserInfo(userId, local){
		if (local){
			const localDB = Users.getLocalDB()
			var result = await localDB.get("select users_no as no,users_id as id,users_name as name,'local' as type,true as admin from users where users_id=? ", userId)
			if (result)
				return result as UserInfo;
		}
		return null
	}
	logout(){
		const user = { no: -1, id: 'GUEST', name: 'GUEST', type: 'normal', admin: false}
		this.setGlobalItem('user', null)
		this.setSessionItem('user', null)
		this.userInfo = user
		return user
	}
	isAdmin() {
		return this.userInfo?this.userInfo.admin:false
	}
	async JS_request(){
		return this.userInfo
	}
	async JS_logout(){
		return this.logout()
	}
	async JS_login(userId:string, userPass:string,local:boolean,keep?:boolean){
		if(await this.isLogin(userId, userPass, local)){
			const result = await Users.getUserInfo(userId, local)
			if (keep)
				this.setGlobalItem('user', result)
			this.setSessionItem('user', result)
			this.userInfo = result
			return result
		}
		return false;
	}
	async JS_setUser(userNo: number, userId: string, userName: string,userPass : string,local:boolean){
		if(!this.isAdmin())
			return false;
		if(local){
			let localDB = Users.getLocalDB()
			//ユーザが存在するか確認
			var userInfo = await localDB.get("select * from users where users_no=?",userNo)
			if (userNo && !userInfo)
				return false
			if (userNo == 0 && (userPass === ''))
				return false

			if(userName === '')
				userName = userId
			var pass = userPass ? getSHA256(userPass) : userInfo.users_password
			let result
			if (userNo == 0){
				result = await localDB.run("insert into users values(null,1,?,?,?,'{}')",
					userId,pass,userName)
			}else{
				//作成したシリアル番号を返す
				result = await localDB.run("update users set users_id=?,users_password=?,users_name=? where users_no=?",
					userId, pass, userName,userNo)
			}
			return result
		}
		return false;
	}
	async JS_delUser(userNo: number, local: boolean) {
		if (!this.isAdmin())
			return false;
		if (local) {
			const localDB = Users.getLocalDB()
			const result = await localDB.run("update users set users_name=null,users_enable=false where users_no=?",userNo)
			return result.changes > 0
		}
		return false

	}
	async JS_getUsers(local){
		if (!this.isAdmin())
			return false;
		if (local) {
			let localDB = Users.getLocalDB()
			//ユーザが存在するか確認
			return await localDB.all("select users_no as no,users_id as id,users_name as name,'local' as type,true as admin from users where users_enable order by no")
		}
		return false
	}


}