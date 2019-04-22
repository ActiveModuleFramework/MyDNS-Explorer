import * as sqlite from 'sqlite3';
/**
 *アイテムオブジェクト保存用クラス
 *
 * @export
 * @class SQLiteDB
 */
export declare class SQLiteDB {
    items: {};
    db: sqlite.Database;
    /**
     *DBを開く
     *
     * @param {string} path DBのパス
     * @returns {Promise<boolean>} true:成功 false:失敗
     * @memberof SQLiteDB
     */
    open(path: string): Promise<boolean>;
    /**
     *継承オーバライド用
     *
     * @memberof SQLiteDB
     */
    protected initDB(): Promise<void>;
    /**
     *DBを開く
     *
     * @private
     * @static
     * @param {string} path DBパス
     * @returns {Promise<sqlite.Database>} DBインスタンス
     * @memberof SQLiteDB
     */
    private static openAsync;
    /**
     *DBを閉じる(継承時処理追加用に非同期)
     *
     * @returns true:成功 false :失敗
     * @memberof SQLiteDB
     */
    close(): Promise<boolean>;
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof SQLiteDB
     */
    setItem(name: string, value: any): void;
    /**
     *
     *
     * @param {string} name
     * @returns {*}
     * @memberof SQLiteDB
     */
    getItem(name: string): any;
    /**
     *
     *
     * @returns {sqlite.Database}
     * @memberof SQLiteDB
     */
    getDB(): sqlite.Database;
    /**
     *SQLiteヘルパークラス
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<sqlite.RunResult>}
     * @memberof SQLiteDB
     */
    run(sql: string, ...params: any): Promise<sqlite.RunResult>;
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise < { [key: string]: any }[] >}
     * @memberof SQLiteDB
     */
    all(sql: string, ...params: any): Promise<{
        [key: string]: any;
    }[]>;
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ rows: { [key: string]: any }[], statement: sqlite.Statement }>}
     * @memberof SQLiteDB
     */
    all2(sql: string, ...params: any): Promise<{
        rows: {
            [key: string]: any;
        }[];
        statement: sqlite.Statement;
    }>;
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ [key: string]: any }>}
     * @memberof SQLiteDB
     */
    get(sql: string, ...params: any): Promise<{
        [key: string]: any;
    }>;
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<{ row: { [key: string]: any }, statement: sqlite.Statement }>}
     * @memberof SQLiteDB
     */
    get2(sql: string, ...params: any): Promise<{
        row: {
            [key: string]: any;
        };
        statement: sqlite.Statement;
    }>;
}
