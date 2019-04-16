import * as express from 'express';
import { Module } from './Module';
import { LocalDB } from './LocalDB';
/**
 *フレームワーク総合管理用クラス
 *
 * @export
 * @class Manager
 */
export declare class Manager {
    localDB: LocalDB;
    stderr: string;
    modules: {
        [key: string]: typeof Module;
    };
    priorityList: typeof Module[][];
    static initFlag: any;
    /**
     *Creates an instance of Manager.
     * @memberof Manager
     */
    constructor();
    /**
     * 初期化処理
     *
     * @param {string} localDBPath	ローカルデータベースパス
     * @param {string} modulePath	モジュールパス
     * @returns {Promise<boolean>}	true:正常終了 false:異常終了
     * @memberof Manager
     */
    init(localDBPath: string, modulePath: string): Promise<boolean>;
    /**
     *Expressの設定を行う
     *
     * @param {express.Express} express	Expressインスタンス
     * @param {string} path				ドキュメントのパス
     * @memberof Manager
     */
    setExpress(express: express.Express, path: string): void;
    /**
     * 終了処理
     *
     * @memberof Manager
     */
    destory(): Promise<void>;
    /**
     *
     *
     * @private
     * @static
     * @param {{ [key: string]: typeof Module }} modules	モジュールリスト
     * @param {typeof Module} module						モジュールタイプ
     * @returns {number} 優先度
     * @memberof Manager
     */
    private static getPriority;
    /**
     *ローカルDBを返す
     *
     * @returns {LocalDB} ローカルDB
     * @memberof Manager
     */
    getLocalDB(): LocalDB;
    /**
     *モジュール処理の区分け実行
     *
     * @private
     * @param {express.Request} req  リクエスト
     * @param {express.Response} res レスポンス
     * @memberof Manager
     */
    private exec;
}
