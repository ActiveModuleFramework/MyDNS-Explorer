"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *セッションデータ管理用クラス
 *
 * @export
 * @class Session
 */
class Session {
    constructor() {
        this.modules = [];
    }
    /**
     *
     *
     * @param {LocalDB} db
     * @param {string} globalHash
     * @param {string} sessionHash
     * @param {{ [key: string]: typeof Module }} moduleTypes
     * @memberof Session
     */
    async init(db, globalHash, sessionHash, moduleTypes) {
        this.localDB = db;
        this.moduleTypes = moduleTypes;
        const global = await db.startSession(globalHash, 96);
        const session = await db.startSession(sessionHash, 1);
        this.globalHash = global.hash;
        this.sessionHash = session.hash;
        this.values = {};
        this.setValue("GLOBAL_ITEM", global.values);
        this.setValue("SESSION_ITEM", session.values);
        await this.request();
    }
    /**
     *
     *
     * @memberof Session
     */
    async final() {
        await this.localDB.endSession(this.sessionHash, this.getValue("SESSION_ITEM"));
        await this.localDB.endSession(this.globalHash, this.getValue("GLOBAL_ITEM"));
    }
    /**
     *
     *
     * @static
     * @param {(session: Session) => {}} func
     * @memberof Session
     */
    static addRequest(func) {
        Session.requests.push(func);
    }
    /**
     *
     *
     * @returns {string}
     * @memberof Session
     */
    getSessionHash() {
        return this.sessionHash;
    }
    /**
     *
     *
     * @param {string} hash
     * @memberof Session
     */
    /**
     *
     *
     * @param {string} hash
     * @memberof Session
     */
    setSessionHash(hash) {
        this.sessionHash = hash;
    }
    /**
     *
     *
     * @returns {string}
     * @memberof Session
     */
    /**
     *
     *
     * @returns {string}
     * @memberof Session
     */
    getGlobalHash() {
        return this.globalHash;
    }
    /**
     *
     *
     * @param {string} hash
     * @memberof Session
     */
    /**
     *
     *
     * @param {string} hash
     * @memberof Session
     */
    setGlobalHash(hash) {
        this.globalHash = hash;
    }
    /**
     *
     *
     * @param {string} value
     * @returns
     * @memberof Session
     */
    /**
     *
     *
     * @param {string} value
     * @returns
     * @memberof Session
     */
    setResult(value) {
        return this.result = value;
    }
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof Session
     */
    setValue(name, value) {
        this.values[name] = value;
    }
    /**
     *
     *
     * @param {string} name
     * @returns
     * @memberof Session
     */
    getValue(name) {
        return this.values[name];
    }
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof Session
     */
    setGlobalItem(name, value) {
        var items = this.getValue("GLOBAL_ITEM");
        if (!items) {
            items = {};
            this.setValue("GLOBAL_ITEM", items);
        }
        items[name] = value;
    }
    getGlobalItem(name, defValue) {
        var items = this.getValue("GLOBAL_ITEM");
        if (!items) {
            return null;
        }
        return (typeof items[name] === 'undefined') ? defValue : items[name];
    }
    setSessionItem(name, value) {
        var items = this.getValue("SESSION_ITEM");
        if (!items) {
            items = {};
            this.setValue("SESSION_ITEM", items);
        }
        items[name] = value;
    }
    getSessionItem(name, defValue) {
        var items = this.getValue("SESSION_ITEM");
        if (!items) {
            return null;
        }
        return (typeof items[name] === 'undefined') ? defValue : items[name];
    }
    getModuleType(name) {
        return this.moduleTypes[name];
    }
    async getModule(constructor) {
        for (let module of this.modules) {
            if (module instanceof constructor) {
                return module;
            }
        }
        try {
            const module = new constructor();
            this.modules.push(module);
            module.setSession(this);
            await module.onStartSession();
            return module;
        }
        catch (e) {
            console.error(e);
            console.error("モジュールインスタンスの生成に失敗:" + constructor.name);
            return null;
        }
    }
    async releaseModules() {
        for (let module of this.modules) {
            await module.onEndSession();
        }
    }
    async request() {
        var p = [];
        for (var i = 0; i < Session.requests.length; i++)
            p.push(Session.requests[i](this));
        await Promise.all(p);
    }
}
Session.requests = [];
exports.Session = Session;
//# sourceMappingURL=Session.js.map