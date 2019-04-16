import { Module } from 'active-module-framework/Module'
import { Users } from '../Users'
import { MyDNSReader } from './MyDNSReader'

/**
 *MyDNS制御用モジュール
 *
 * @export
 * @class MyDNS
 * @extends {Module}
 */
export class MyDNS extends Module {
	/**
	 *モジュール初期化処理
	 *
	 * @static
	 * @returns {Promise<boolean>}
	 * @memberof MyDNS
	 */
	static async onCreateModule(): Promise<boolean> {
		const localDB = Module.getLocalDB()
		localDB.run(
			'CREATE TABLE IF NOT EXISTS mydns (mydns_id text primary key,mydns_password text,mydns_info json)')

		return true;
	}

	/**
	 *登録アカウントのDNS情報を更新
	 *
	 * @returns {Promise<boolean>} true:成功 false:失敗
	 * @memberof MyDNS
	 */
	async JS_update() :Promise<boolean>{
		const users = await this.getModule(Users)
		if (!users.isAdmin())
			return false
		const localDB = Module.getLocalDB()
		const results = await localDB.all('select mydns_id as id,mydns_password as pass from mydns')
		const promise: Promise<any>[] = []
		for (const result of results) {
			const id = result.id
			const pass = result.pass
			const p = (async () => {
				const reader = new MyDNSReader()
				if (!await reader.getSession(id, pass))
					return false
				const info = await reader.getInfo()
				if (!info)
					return false
				const result = await localDB.run('update mydns set mydns_info=? where mydns_id=?', JSON.stringify(info), id)
				return result.changes > 0
			})()
			promise.push(p)
		}
		const r = await Promise.all(promise)
		for (const flag of r) {
			if (!flag)
				return false
		}
		return true
	}
	/**
	 *MyDNSユーザ情報の追加
	 *
	 * @param {string} id
	 * @param {string} pass
	 * @returns {Promise<boolean>}
	 * @memberof MyDNS
	 */
	async JS_addUser(id: string, pass: string):Promise<boolean> {
		const users = await this.getModule(Users)
		if (!users.isAdmin())
			return false
		const reader = new MyDNSReader()
		if (!await reader.getSession(id, pass))
			return false
		const info = await reader.getInfo()
		if (!info)
			return false

		const localDB = Module.getLocalDB()
		const result = await localDB.run('replace into mydns values(?,?,?)', id, pass, JSON.stringify(info))
		return result.changes > 0
	}
	/**
	 *MyDNSユーザ情報の削除
	 *
	 * @param {string} id
	 * @returns
	 * @memberof MyDNS
	 */
	async JS_delUser(id: string) {
		const users = await this.getModule(Users)
		if (!users.isAdmin())
			return false
		const localDB = Module.getLocalDB()
		const result = await localDB.run('delete from mydns where mydns_id=?', id)
		return result.changes > 0
	}
	/**
	 *MyDNSユーザリストの取得
	 *
	 * @returns
	 * @memberof MyDNS
	 */
	async JS_getUsers() {
		const session = this.getSession()
		const users = await session.getModule(Users)
		if (!users.isAdmin())
			return false
		const localDB = Module.getLocalDB()
		const results = await localDB.all('select mydns_id as id,mydns_info as info from mydns')
		for (const result of results) {
			result.info = JSON.parse(result.info)
		}
		return results
	}
}