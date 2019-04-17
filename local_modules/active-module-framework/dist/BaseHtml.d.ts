import * as express from 'express';
/**
 *トップページ表示用クラス
*
* @export
* @class BaseHtml
*/
export declare class BaseHtml {
    /**
     *初期ページの出力
    *
    * @static
    * @param {express.Response} res	レスポンス
    * @param {string[]} cssPath		CSSディレクトリ
    * @param {string[]} jsPath			JSディレクトリ
    * @param {string[]} priorityJs		優先度の高いJSファイル
    * @memberof BaseHtml
    */
    static output(res: express.Response, cssPath: string[], jsPath: string[], priorityJs: string[]): Promise<boolean>;
}
