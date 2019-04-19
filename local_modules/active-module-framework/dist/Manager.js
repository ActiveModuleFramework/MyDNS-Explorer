"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const capcon = require("capture-console");
const path = require("path");
const express = require("express");
const LocalDB_1 = require("./LocalDB");
const Session_1 = require("./Session");
const BaseHtml_1 = require("./BaseHtml");
/**
 *フレームワーク総合管理用クラス
 *
 * @export
 * @class Manager
 */
class Manager {
    /**
     *Creates an instance of Manager.
     * @memberof Manager
     */
    constructor(params) {
        this.localDB = new LocalDB_1.LocalDB();
        this.stderr = '';
        this.debug = params.debug;
        this.express = express();
        this.output('--- Start Manager');
        //エラーメッセージをキャプチャ
        capcon.startCapture(process.stderr, (stderr) => {
            this.stderr += stderr;
        });
        this.init(params);
    }
    /**
     *
     *
     * @param {string} msg
     * @param {*} params
     * @memberof Manager
     */
    output(msg, ...params) {
        if (this.debug)
            console.log(msg, ...params);
    }
    /**
     * 初期化処理
     *
     * @param {string} localDBPath	ローカルデータベースパス
     * @param {string} modulePath	モジュールパス
     * @returns {Promise<boolean>}	true:正常終了 false:異常終了
     * @memberof Manager
     */
    async init(params) {
        //ファイルの存在確認
        function isExistFile(path) {
            try {
                fs.statSync(path);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        //Expressの初期化
        this.initExpress(params);
        //ローカルDBを開く
        if (!await this.localDB.open(params.localDBPath)) {
            console.error("ローカルDBオープンエラー:%s", params.localDBPath);
            return false;
        }
        //カレントパスの取得
        const cpath = path.resolve("");
        //モジュールを読み出す
        const files = fs.readdirSync(params.modulePath, { withFileTypes: true });
        const modules = {};
        for (let ent of files) {
            let r;
            if (ent.isFile()) {
                let name = ent.name;
                let ext = name.slice(-3);
                let ext2 = name.slice(-5);
                if (ext === '.js' || (ext === '.ts' && ext2 !== '.d.ts'))
                    r = require(cpath + '/' + params.modulePath + '/' + name);
            }
            else if (ent.isDirectory()) {
                const basePath = `${cpath}/${params.modulePath}/${ent.name}/`;
                let path = null;
                for (const name of ['index.ts', 'index.js', ent.name + '.ts', ent.name + '.js']) {
                    if (isExistFile(basePath + name)) {
                        path = basePath + name;
                        break;
                    }
                }
                if (path)
                    r = require(path);
            }
            if (r) {
                const name = Object.keys(r)[0];
                modules[name] = r[name];
            }
        }
        this.modules = modules;
        //依存関係の重み付け
        const sortList = [];
        for (let index in modules) {
            const module = modules[index];
            sortList.push({ key: Manager.getPriority(modules, module), module: module });
        }
        sortList.sort(function (a, b) {
            return a.key - b.key;
        });
        //重み付けを配列のキーに変換
        const priorityList = [];
        for (let v of sortList) {
            const key = v.key - 1;
            if (priorityList[key])
                priorityList[key].push(v.module);
            else
                priorityList[key] = [v.module];
        }
        this.priorityList = priorityList;
        //依存関係を考慮して初期化
        let flag = true;
        for (let v in priorityList) {
            let modules = priorityList[v];
            for (let module of modules) {
                if (module.onCreateModule) {
                    module.setManager(this);
                    try {
                        this.output("モジュール初期化:%s", module.name);
                        const result = await module.onCreateModule();
                        if (!result) {
                            console.error("モジュール初期化エラー:%s", module.name);
                            flag = false;
                            break;
                        }
                        if (!flag) {
                            Manager.initFlag = false;
                            return false;
                        }
                    }
                    catch (err) {
                        console.error("モジュール初期化例外");
                        console.error(err);
                        Manager.initFlag = false;
                        return false;
                    }
                }
            }
        }
        Manager.initFlag = true;
        this.listen(params.listen);
        return true;
    }
    /**
     *Expressの設定を行う
     *
     * @param {string} path				ドキュメントのパス
     * @memberof Manager
     */
    initExpress(params) {
        const commands = { exec: null };
        commands.exec = (req, res) => { this.exec(req, res); };
        //一般コンテンツの対応付け
        this.express.use(params.remotePath, express.static(params.rootPath));
        //クライアント接続時の処理
        this.express.all(params.remotePath, async (req, res, next) => {
            console.log("[" + JSON.stringify(req.baseUrl) + "]");
            //初期化が完了しているかどうか
            if (!Manager.initFlag) {
                res.header("Content-Type", "text/plain; charset=utf-8");
                res.end(this.stderr);
                return;
            }
            //コマンドパラメータの解析
            const cmd = req.query.cmd;
            if (cmd != null) {
                const command = commands[cmd];
                if (command != null) {
                    command(req, res);
                }
                else {
                    res.json({ error: "リクエストエラー" });
                }
            }
            else {
                console.log(req.rawHeaders);
                const path = (req.header('location_path') || '') + params.remotePath;
                if (!await BaseHtml_1.BaseHtml.output(res, path, params.rootPath, params.cssPath, params.jsPath, params.jsPriority))
                    next();
            }
        });
    }
    /**
     * 終了処理
     *
     * @memberof Manager
     */
    async destory() {
        const priorityList = this.priorityList;
        for (let i = priorityList.length - 1; i >= 0; i--) {
            const modules = priorityList[i];
            const promise = [];
            for (const module of modules) {
                this.output("モジュール解放化:%s", module.name);
                if (module.onDestroyModule)
                    promise.push(module.onDestroyModule());
            }
            await Promise.all(promise);
        }
        this.output('--- Stop Manager');
    }
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
    static getPriority(modules, module) {
        if (module == null)
            return 0;
        const request = module["REQUEST"];
        let priority = 1;
        if (!request)
            return priority;
        for (const module2 of request) {
            priority = Math.max(priority, Manager.getPriority(modules, modules[module2]) + 1);
        }
        return priority;
    }
    /**
     *ローカルDBを返す
     *
     * @returns {LocalDB} ローカルDB
     * @memberof Manager
     */
    getLocalDB() {
        return this.localDB;
    }
    /**
     *モジュール処理の区分け実行
     *
     * @private
     * @param {express.Request} req  リクエスト
     * @param {express.Response} res レスポンス
     * @memberof Manager
     */
    exec(req, res) {
        let postData = "";
        req.on('data', function (v) {
            postData += v;
        }).on('end', async () => {
            const params = JSON.parse(postData);
            //マネージャ機能をセッション用にコピー
            const session = new Session_1.Session();
            await session.init(this.localDB, params.globalHash, params.sessionHash, this.modules);
            session.result = { globalHash: session.getGlobalHash(), sessionHash: session.getSessionHash(), results: [] };
            if (params.functions) {
                const results = session.result.results;
                //要求された命令の解析と実行
                for (const func of params.functions) {
                    const result = { value: null, error: null };
                    results.push(result);
                    if (!func.function) {
                        result.error = util.format("命令が指定されていない", func.function);
                        continue;
                    }
                    const name = func.function.split('.');
                    if (name.length != 2) {
                        result.error = util.format("クラス名が指定されていない: %s", func.function);
                        continue;
                    }
                    if (!this.modules[name[0]]) {
                        result.error = util.format("クラスが存在しない: %s", func.function);
                        continue;
                    }
                    //クラスインスタンスを取得
                    const classPt = await session.getModule(this.modules[name[0]]);
                    //ファンクション名にプレフィックスを付ける
                    const funcName = 'JS_' + name[1];
                    //ファンクションを取得
                    const funcPt = classPt[funcName];
                    if (!funcPt) {
                        result.error = util.format("命令が存在しない: %s", func.function);
                        continue;
                    }
                    if (!func.params) {
                        result.error = util.format("パラメータ書式エラー: %s", func.function);
                        continue;
                    }
                    if (funcPt.length !== func.params.length) {
                        result.error = util.format("パラメータの数が一致しない: %s", func.function);
                        continue;
                    }
                    //命令の実行
                    try {
                        this.output('命令実行: %s %s', funcName, JSON.stringify(func.params));
                        result.value = await funcPt.call(classPt, ...func.params);
                        this.output('実行結果: %s', JSON.stringify(result.value));
                    }
                    catch (e) {
                        console.error(e);
                        result.error = util.format("モジュール実行エラー: %s", func.function);
                        continue;
                    }
                }
                //セッション終了
                session.final();
            }
            //クライアントに返すデータを設定
            res.json(session.result);
            res.end();
        });
    }
    //待ち受け設定
    listen(value) {
        let port = 0;
        let path = null;
        if (typeof value === 'number') {
            port = value + parseInt(process.env.NODE_APP_INSTANCE || '0');
        }
        else {
            path = value + '.' + (process.env.NODE_APP_INSTANCE || '0');
        }
        //終了時の処理(Windowsでは動作しない)
        process.on('SIGINT', onExit);
        process.on('SIGTERM', onExit);
        async function onExit(code) {
            await this.manager.destory();
            if (path)
                this.removeSock(path); //ソケットファイルの削除
            process.exit(code);
        }
        if (port) {
            this.express.listen(port); //ソケットの待ち受け設定
            this.output('localhost:%d', port);
        }
        else {
            this.removeSock(path); //ソケットファイルの削除
            this.express.listen(path); //ソケットの待ち受け設定
            this.output(path);
            try {
                fs.chmodSync(path, '666'); //ドメインソケットのアクセス権を設定
            }
            catch (e) { }
        }
    }
    /**
     *前回のソケットファイルの削除
    *
    * @memberof Main
    */
    removeSock(path) {
        try {
            fs.unlinkSync(path);
        }
        catch (e) { }
    }
}
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map