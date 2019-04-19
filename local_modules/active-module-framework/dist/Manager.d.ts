import * as express from 'express';
import { AmfModule } from './AmfModule';
import { LocalDB } from './LocalDB';
/**
 *マネージャ初期化用パラメータ
 *
 * @export
 * @interface ManagerParams
 * @property {string} rootPath	一般コンテンツのローカルパス
 * @property {string} remotePath 一般コンテンツのリモートパス
 * @property {string} execPath	コマンド実行用リモートパス
 * @property {string} localDBPath	ローカルDBパス
 * @property {string} modulePath	モジュール配置パス
 * @property {string[]} cssPath	自動ロード用CSSパス
 * @property {string[]} jsPath	一般コンテンツのローカルパス
 * @property {string[]} jsPriority	優先JSファイル設定
 * @property {boolean} debug	デバッグ用メッセージ出力
 * @property {number | string} listen	受付ポート/UNIXドメインソケット
 */
export interface ManagerParams {
    rootPath: string;
    remotePath: string;
    execPath: string;
    localDBPath: string;
    modulePath: string;
    cssPath: string[];
    jsPath: string[];
    jsPriority: string[];
    debug: boolean;
    listen: number | string;
}
/**
 *フレームワーク総合管理用クラス
 *
 * @export
 * @class Manager
 */
export declare class Manager {
    debug: boolean;
    localDB: LocalDB;
    stderr: string;
    modules: {
        [key: string]: typeof AmfModule;
    };
    priorityList: typeof AmfModule[][];
    express: express.Express;
    static initFlag: any;
    /**
     *Creates an instance of Manager.
     * @memberof Manager
     */
    constructor(params: ManagerParams);
    /**
     *
     *
     * @param {string} msg
     * @param {*} params
     * @memberof Manager
     */
    output(msg: string, ...params: any[]): void;
    /**
     * 初期化処理
     *
     * @param {string} localDBPath	ローカルデータベースパス
     * @param {string} modulePath	モジュールパス
     * @returns {Promise<boolean>}	true:正常終了 false:異常終了
     * @memberof Manager
     */
    init(params: ManagerParams): Promise<boolean>;
    /**
     *Expressの設定を行う
     *
     * @param {string} path				ドキュメントのパス
     * @memberof Manager
     */
    initExpress(params: ManagerParams): void;
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
    listen(value: number | string): void;
    /**
     *前回のソケットファイルの削除
    *
    * @memberof Main
    */
    removeSock(path: string): void;
}
