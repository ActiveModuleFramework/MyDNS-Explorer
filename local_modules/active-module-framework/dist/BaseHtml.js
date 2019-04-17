"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
const path = require("path");
const fsp = fs.promises;
/**
 *トップページ表示用クラス
*
* @export
* @class BaseHtml
*/
class BaseHtml {
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
    static async output(res, cssPath, jsPath, priorityJs) {
        function createJSInclude(files) {
            let s = "";
            for (const file of files) {
                if (path.extname(file).toLowerCase() === '.js')
                    s += util.format('\n\t<script type="text/javascript" src="js/%s"></script>', file);
            }
            return s;
        }
        function createCSSInclude(files) {
            let s = "";
            for (const file of files) {
                if (path.extname(file).toLowerCase() === '.css')
                    s += util.format('\n\t<link rel="stylesheet" href="css/%s">', file);
            }
            return s;
        }
        const wait = [];
        wait.push(fsp.readFile('template/index.html', 'utf-8'));
        //CSSファイルリストの読み込み
        for (let dir of cssPath)
            wait.push(fsp.readdir(dir));
        //JSファイルリストの読み込み
        for (let dir of jsPath)
            wait.push(fsp.readdir(dir));
        const recvList = await Promise.all(wait).catch(() => { return null; });
        if (!recvList) {
            return false;
        }
        const html = recvList[0];
        const cssFiles = [];
        const jsFiles = [];
        let index = 1;
        for (let i = 0; i < cssPath.length; i++) {
            Object.assign(cssFiles, recvList[index + i]);
        }
        index += cssPath.length;
        for (let i = 0; i < jsPath.length; i++) {
            Object.assign(jsFiles, recvList[index + i]);
        }
        //JSを優先順位に従って並び替え
        for (let i = priorityJs.length - 1; i >= 0; --i) {
            const index = jsFiles.indexOf(priorityJs[i]);
            if (index >= 0) {
                jsFiles.splice(index, 1);
                jsFiles.unshift(priorityJs[i]);
            }
        }
        const data = html.replace("[[SCRIPTS]]", createJSInclude(jsFiles))
            .replace("[[CSS]]", createCSSInclude(recvList[1]));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(data);
        return true;
    }
}
exports.BaseHtml = BaseHtml;
//# sourceMappingURL=BaseHtml.js.map