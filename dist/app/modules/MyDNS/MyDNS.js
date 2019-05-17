"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework");
const Users_1 = require("../Users");
const MyDNSReader_1 = require("./MyDNSReader");
/**
 *MyDNS制御用モジュール
 *
 * @export
 * @class MyDNS
 * @extends {amf.Module}
 */
class MyDNS extends amf.Module {
    /**
     *モジュール初期化処理
     *
     * @static
     * @returns {Promise<boolean>}
     * @memberof MyDNS
     */
    static async onCreateModule() {
        const localDB = amf.Module.getLocalDB();
        localDB.run('CREATE TABLE IF NOT EXISTS mydns (mydns_id text primary key,mydns_password text,mydns_info json)');
        return true;
    }
    /**
     *登録アカウントのDNS情報を更新
     *
     * @returns {Promise<boolean>} true:成功 false:失敗
     * @memberof MyDNS
     */
    async JS_update() {
        const users = await this.getModule(Users_1.Users);
        if (!users || !users.isAdmin())
            return false;
        const localDB = amf.Module.getLocalDB();
        const results = await localDB.all('select mydns_id as id,mydns_password as pass from mydns');
        const promise = [];
        for (const result of results) {
            const id = result.id;
            const pass = result.pass;
            const p = (async () => {
                const reader = new MyDNSReader_1.MyDNSReader();
                if (!await reader.getSession(id, pass))
                    return false;
                const info = await reader.getInfo();
                if (!info)
                    return false;
                const result = await localDB.run('update mydns set mydns_info=? where mydns_id=?', JSON.stringify(info), id);
                return result.changes > 0;
            })();
            promise.push(p);
        }
        const r = await Promise.all(promise);
        for (const flag of r) {
            if (!flag)
                return false;
        }
        return true;
    }
    /**
     *MyDNSユーザ情報の追加
     *
     * @param {string} id
     * @param {string} pass
     * @returns {Promise<boolean>}
     * @memberof MyDNS
     */
    async JS_addUser(id, pass) {
        const users = await this.getModule(Users_1.Users);
        if (!users || !users.isAdmin())
            return false;
        const reader = new MyDNSReader_1.MyDNSReader();
        if (!await reader.getSession(id, pass))
            return false;
        const info = await reader.getInfo();
        if (!info)
            return false;
        const localDB = amf.Module.getLocalDB();
        const result = await localDB.run('replace into mydns values(?,?,?)', id, pass, JSON.stringify(info));
        return result.changes > 0;
    }
    /**
     *MyDNSユーザ情報の削除
     *
     * @param {string} id
     * @returns
     * @memberof MyDNS
     */
    async JS_delUser(id) {
        const users = await this.getModule(Users_1.Users);
        if (!users || !users.isAdmin())
            return false;
        const localDB = amf.Module.getLocalDB();
        const result = await localDB.run('delete from mydns where mydns_id=?', id);
        return result.changes > 0;
    }
    /**
     *パスワードを返す
     *
     * @param {string} id MyDNSのID
     * @returns {string} MyDNSのパスワード
     * @memberof MyDNS
     */
    async JS_getPassword(id) {
        const session = this.getSession();
        const users = await session.getModule(Users_1.Users);
        if (!users || !users.isAdmin())
            return false;
        const localDB = amf.Module.getLocalDB();
        return await localDB.get('select mydns_password as pass from mydns where mydns_id=?', id);
    }
    /**
     *MyDNSユーザリストの取得
     *
     * @returns
     * @memberof MyDNS
     */
    async JS_getUsers() {
        const session = this.getSession();
        const users = await session.getModule(Users_1.Users);
        if (!users || !users.isAdmin())
            return false;
        const localDB = amf.Module.getLocalDB();
        const results = await localDB.all('select mydns_id as id,mydns_info as info from mydns');
        for (const result of results) {
            result.info = JSON.parse(result.info);
        }
        return results;
    }
}
exports.MyDNS = MyDNS;
//# sourceMappingURL=MyDNS.js.map