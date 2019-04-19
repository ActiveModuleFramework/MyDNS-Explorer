"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *モジュール作成用基本クラス
 *
 * @export
 * @class Module
 */
class AmfModule {
    static setManager(manager) { AmfModule.manager = manager; }
    static getManager() { return AmfModule.manager; }
    static async onCreateModule() { return true; }
    static async onDestroyModule() { return true; }
    static getLocalDB() { return AmfModule.manager.getLocalDB(); }
    static output(msg, ...params) { AmfModule.manager.output(msg, ...params); }
    setSession(session) { this.session = session; }
    async onStartSession() { }
    async onEndSession() { }
    getSession() { return this.session; }
    getGlobalItem(name) { return this.session.getGlobalItem(name); }
    setGlobalItem(name, value) { this.session.setGlobalItem(name, value); }
    getSessionItem(name) { return this.session.getSessionItem(name); }
    setSessionItem(name, value) { this.session.setSessionItem(name, value); }
    getModule(constructor) { return this.session.getModule(constructor); }
}
exports.AmfModule = AmfModule;
//# sourceMappingURL=AmfModule.js.map