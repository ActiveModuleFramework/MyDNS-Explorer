"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
const path = require("path");
const sprintf_1 = require("sprintf");
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
    static async output(res, baseUrl, rootPath, cssPath, jsPath, priorityJs) {
        function createJSInclude(files) {
            let s = "";
            for (const file of files) {
                const dir = file.dir;
                s += util.format('\n\t<script type="text/javascript" src="%s/%s"></script>', dir, file.name);
            }
            return s;
        }
        function createCSSInclude(files) {
            let s = "";
            for (const file of files) {
                const dir = file.dir;
                s += util.format('\n\t<link rel="stylesheet" href="%s/%s">', dir, file.name);
            }
            return s;
        }
        //ファイル名に日付情報を追加
        function addDateParam(files) {
            for (const file of files) {
                const date = file.date;
                file.name +=
                    sprintf_1.sprintf('?ver=%04d%02d%02d%02d%02d%02d', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            }
        }
        let html;
        try {
            html = fs.readFileSync('template/index.html', 'utf-8');
        }
        catch (e) {
            return false;
        }
        const cssFiles = [];
        const jsFiles = [];
        //CSSファイルリストの読み込み
        for (let dir of cssPath) {
            const files = fs.readdirSync(`${rootPath}/${dir}`);
            for (const name of files) {
                if (path.extname(name).toLowerCase() === '.css') {
                    const stat = fs.statSync(`${rootPath}/${dir}/${name}`);
                    cssFiles.push({ dir, name, date: stat.mtime });
                }
            }
        }
        //JSファイルリストの読み込み
        for (let dir of jsPath) {
            const files = fs.readdirSync(`${rootPath}/${dir}`);
            for (const name of files) {
                if (path.extname(name).toLowerCase() === '.js') {
                    const stat = fs.statSync(`${rootPath}/${dir}/${name}`);
                    jsFiles.push({ dir, name, date: stat.mtime });
                }
            }
        }
        //JSを優先順位に従って並び替え
        jsFiles.sort((a, b) => {
            const v1 = priorityJs.indexOf(a.name);
            const v2 = priorityJs.indexOf(b.name);
            return v2 - v1;
        });
        //時間情報の追加(キャッシュ対策)
        addDateParam(jsFiles);
        addDateParam(cssFiles);
        const data = html.replace("[[SCRIPTS]]", createJSInclude(jsFiles))
            .replace("[[CSS]]", createCSSInclude(cssFiles));
        const links = [];
        for (const file of cssFiles) {
            const dir = file.dir;
            links.push(`<${baseUrl}/${dir}/${file.name}>;rel=preload;as=style;`);
        }
        for (const file of jsFiles) {
            const dir = file.dir;
            links.push(`<${baseUrl}/${dir}/${file.name}>;rel=preload;as=script;`);
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8', 'link': links });
        res.end(data);
        return true;
    }
}
exports.BaseHtml = BaseHtml;
//# sourceMappingURL=BaseHtml.js.map