"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const capcon = require("capture-console");
const path = require("path");
const LocalDB_1 = require("./LocalDB");
const Session_1 = require("./Session");
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
    constructor() {
        this.localDB = new LocalDB_1.LocalDB();
        this.stderr = '';
        console.log('--- Start Manager');
        //エラーメッセージをキャプチャ
        capcon.startCapture(process.stderr, (stderr) => {
            this.stderr += stderr;
        });
    }
    /**
     * 初期化処理
     *
     * @param {string} localDBPath	ローカルデータベースパス
     * @param {string} modulePath	モジュールパス
     * @returns {Promise<boolean>}	true:正常終了 false:異常終了
     * @memberof Manager
     */
    async init(localDBPath, modulePath) {
        function isExistFile(path) {
            try {
                fs.statSync(path);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        //ローカルDBを開く
        if (!await this.localDB.open(localDBPath)) {
            console.error("ローカルDBオープンエラー:%s", localDBPath);
            return false;
        }
        //カレントパスの取得
        const cpath = path.resolve("");
        //モジュールを読み出す
        const files = fs.readdirSync(modulePath, { withFileTypes: true });
        const modules = {};
        for (let ent of files) {
            let r;
            if (ent.isFile()) {
                r = require(cpath + '/' + modulePath + '/' + ent.name);
            }
            else if (ent.isDirectory()) {
                const basePath = `${cpath}/${modulePath}/${ent.name}/`;
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
                        console.log("モジュール初期化:%s", module.name);
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
        return true;
    }
    /**
     *Expressの設定を行う
     *
     * @param {express.Express} express	Expressインスタンス
     * @param {string} path				ドキュメントのパス
     * @memberof Manager
     */
    setExpress(express, path) {
        const commands = { exec: null };
        commands.exec = (req, res) => { this.exec(req, res); };
        //クライアント接続時の処理
        express.all(path, (req, res, next) => {
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
                console.log("モジュール解放化:%s", module.name);
                if (module.onDestroyModule)
                    promise.push(module.onDestroyModule());
            }
            await Promise.all(promise);
        }
        console.log('--- Stop Manager');
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
                        console.log('命令実行: %s %s', funcName, JSON.stringify(func.params));
                        result.value = await funcPt.call(classPt, ...func.params);
                        console.log('実行結果: %s', JSON.stringify(result.value));
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
}
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map