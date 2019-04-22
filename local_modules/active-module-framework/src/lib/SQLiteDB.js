"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite = require("sqlite3");
/**
 *アイテムオブジェクト保存用クラス
 *
 * @export
 * @class SQLiteDB
 */
class SQLiteDB {
    /**
     *DBを開く
     *
     * @param {string} path DBのパス
     * @returns {Promise<boolean>} true:成功 false:失敗
     * @memberof SQLiteDB
     */
    async open(path) {
        //DBを開く
        const db = await SQLiteDB.openAsync(path);
        if (!db)
            return false;
        this.db = db;
        //タイムアウト設定
        this.db.configure('busyTimeout', 15000);
        //アイテム用テーブルの作成
        await this.run('CREATE TABLE IF NOT EXISTS app_data (name text primary key,value json)');
        var json = await this.get('select json_group_object(name,json(value)) as value from app_data');
        this.items = JSON.parse(json.value);
        //継承クラスの初期化処理
        await this.initDB();
        return true;
    }
    /**
     *継承オーバライド用
     *
     * @memberof SQLiteDB
     */
    async initDB() { }
    /**
     *DBを開く
     *
     * @private
     * @static
     * @param {string} path DBパス
     * @returns {Promise<sqlite.Database>} DBインスタンス
     * @memberof SQLiteDB
     */
    static async openAsync(path) {
        return new Promise((resolve) => {
            new sqlite.Database(path, function (err) {
                if (err) {
                    resolve(null);
                }
                else {
                    resolve(this);
                }
            });
        });
    }
    /**
     *DBを閉じる(継承時処理追加用に非同期)
     *
     * @returns true:成功 false :失敗
     * @memberof SQLiteDB
     */
    async close() {
        if (!this.db)
            return false;
        this.db.close();
        return true;
    }
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof SQLiteDB
     */
    setItem(name, value) {
        this.items[name] = value;
        this.run('replace into app_data values(?,?)', name, JSON.stringify(value));
    }
    /**
     *
     *
     * @param {string} name
     * @returns {*}
     * @memberof SQLiteDB
     */
    getItem(name) {
        return this.items[name];
    }
    /**
     *
     *
     * @returns {sqlite.Database}
     * @memberof SQLiteDB
     */
    getDB() {
        return this.db;
    }
    /**
     *SQLiteヘルパークラス
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<sqlite.RunResult>}
     * @memberof SQLiteDB
     */
    run(sql, ...params) {
        return new Promise((resolv, reject) => {
            this.db.run(sql, ...params, function (error) {
                if (error)
                    reject(error);
                else
                    resolv(this);
            });
        });
    }
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise < { [key: string]: any }[] >}
     * @memberof SQLiteDB
     */
    all(sql, ...params) {
        return new Promise((resolv, reject) => {
            this.db.all(sql, ...params, function (error, rows) {
                if (error)
                    reject(error);
                else {
                    resolv(rows);
                }
            });
        });
    }
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ rows: { [key: string]: any }[], statement: sqlite.Statement }>}
     * @memberof SQLiteDB
     */
    all2(sql, ...params) {
        return new Promise((resolv, reject) => {
            this.db.all(sql, ...params, function (error, rows) {
                if (error)
                    reject(error);
                else {
                    resolv({ rows: rows, statement: this });
                }
            });
        });
    }
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ [key: string]: any }>}
     * @memberof SQLiteDB
     */
    get(sql, ...params) {
        return new Promise((resolv, reject) => {
            this.db.get(sql, ...params, function (error, row) {
                if (error)
                    reject(error);
                else {
                    resolv(row);
                }
            });
        });
    }
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ row: { [key: string]: any }, statement: sqlite.Statement }>}
     * @memberof SQLiteDB
     */
    get2(sql, ...params) {
        return new Promise((resolv, reject) => {
            this.db.get(sql, ...params, function (error, row) {
                if (error)
                    reject(error);
                else {
                    resolv({ row: row, statement: this });
                }
            });
        });
    }
}
exports.SQLiteDB = SQLiteDB;
