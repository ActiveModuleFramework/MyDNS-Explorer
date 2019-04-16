"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const ItemDB_1 = require("./ItemDB");
/**
 *ローカルDB制御用クラス
 *
 * @export
 * @class LocalDB
 * @extends {ItemDB}
 */
class LocalDB extends ItemDB_1.ItemDB {
    /**
     *
     *
     * @memberof LocalDB
     */
    async initDB() {
        await this.run('CREATE TABLE IF NOT EXISTS session (id text primary key,date real,server json)');
        await this.run('CREATE INDEX IF NOT EXISTS idx_session_date on session(date)');
    }
    /**
     *
     *
     * @param {string} hash
     * @param {number} expire
     * @returns {Promise<{ hash: string, values: { [key: string]: any }}>}
     * @memberof LocalDB
     */
    async startSession(hash, expire) {
        let id = hash;
        if (id) {
            //一時間経過したセッションを削除
            await this.run("delete from session where date < datetime(current_timestamp , ?||' hour')", -expire);
            //セッションを抽出
            let result = await this.get("select id,server from session where id=?", id);
            if (result) {
                return { hash: result.id, values: JSON.parse(result.server) };
            }
        }
        return { hash: await this.createSession(), values: {} };
    }
    /**
     *
     *
     * @param {string} hash
     * @param {{[key:string]:any}} values
     * @returns
     * @memberof LocalDB
     */
    async endSession(hash, values) {
        this.run("update session set date=current_timestamp,server=? where id=?", JSON.stringify(values), hash);
        return true;
    }
    /**
     *
     *
     * @returns
     * @memberof LocalDB
     */
    async createSession() {
        var id = uuid();
        do {
            const result = await this.all("select id from session where id=?", id);
            if (result.length)
                id = null;
        } while (id === null);
        await this.run("insert into session values(?,CURRENT_TIMESTAMP,json_object())", id);
        return id;
    }
}
exports.LocalDB = LocalDB;
//# sourceMappingURL=LocalDB.js.map