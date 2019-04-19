import { AmfModule } from 'active-module-framework/AmfModule';
/**
 *MyDNS制御用モジュール
 *
 * @export
 * @class MyDNS
 * @extends {AmfModule}
 */
export declare class MyDNS extends AmfModule {
    /**
     *モジュール初期化処理
     *
     * @static
     * @returns {Promise<boolean>}
     * @memberof MyDNS
     */
    static onCreateModule(): Promise<boolean>;
    /**
     *登録アカウントのDNS情報を更新
     *
     * @returns {Promise<boolean>} true:成功 false:失敗
     * @memberof MyDNS
     */
    JS_update(): Promise<boolean>;
    /**
     *MyDNSユーザ情報の追加
     *
     * @param {string} id
     * @param {string} pass
     * @returns {Promise<boolean>}
     * @memberof MyDNS
     */
    JS_addUser(id: string, pass: string): Promise<boolean>;
    /**
     *MyDNSユーザ情報の削除
     *
     * @param {string} id
     * @returns
     * @memberof MyDNS
     */
    JS_delUser(id: string): Promise<boolean>;
    /**
     *MyDNSユーザリストの取得
     *
     * @returns
     * @memberof MyDNS
     */
    JS_getUsers(): Promise<false | {
        [key: string]: any;
    }[]>;
}
