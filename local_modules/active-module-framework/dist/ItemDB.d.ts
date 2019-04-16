import * as sqlite from 'sqlite3';
/**
 *アイテムオブジェクト保存用クラス
 *
 * @export
 * @class ItemDB
 */
export declare class ItemDB {
    items: {};
    db: sqlite.Database;
    /**
     *DBを開く
     *
     * @param {string} path DBのパス
     * @returns {Promise<boolean>} true:成功 false:失敗
     * @memberof ItemDB
     */
    open(path: string): Promise<boolean>;
    /**
     *継承オーバライド用
     *
     * @memberof ItemDB
     */
    protected initDB(): Promise<void>;
    /**
     *DBを開く
     *
     * @private
     * @static
     * @param {string} path DBパス
     * @returns {Promise<sqlite.Database>} DBインスタンス
     * @memberof ItemDB
     */
    private static openAsync;
    /**
     *DBを閉じる(継承時処理追加用に非同期)
     *
     * @returns true:成功 false :失敗
     * @memberof ItemDB
     */
    close(): Promise<boolean>;
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof ItemDB
     */
    setItem(name: string, value: any): void;
    /**
     *
     *
     * @param {string} name
     * @returns {*}
     * @memberof ItemDB
     */
    getItem(name: string): any;
    /**
     *
     *
     * @returns {sqlite.Database}
     * @memberof ItemDB
     */
    getDB(): sqlite.Database;
    /**
     *SQLiteヘルパークラス
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise<sqlite.RunResult>}
     * @memberof ItemDB
     */
    run(sql: string, ...params: any): Promise<sqlite.RunResult>;
    /**
     *
     *
     * @param {string} sql
     * @param {...any} params
     * @returns {Promise < { [key: string]: any }[] >}
     * @memberof ItemDB
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
     * @memberof ItemDB
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
     * @memberof ItemDB
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
     * @memberof ItemDB
     */
    get2(sql: string, ...params: any): Promise<{
        row: {
            [key: string]: any;
        };
        statement: sqlite.Statement;
    }>;
}
