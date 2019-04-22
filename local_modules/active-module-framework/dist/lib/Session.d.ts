import { LocalDB } from "./LocalDB";
import { Module } from "./Module";
/**
 *セッションデータ管理用クラス
 *
 * @export
 * @class Session
 */
export declare class Session {
    static requests: ((session: Session) => {})[];
    sessionHash: string;
    globalHash: string;
    result: any;
    values: {
        [key: string]: any;
    };
    localDB: LocalDB;
    moduleTypes: {
        [key: string]: typeof Module;
    };
    modules: Module[];
    /**
     *
     *
     * @param {LocalDB} db
     * @param {string} globalHash
     * @param {string} sessionHash
     * @param {{ [key: string]: typeof Module }} moduleTypes
     * @memberof Session
     */
    init(db: LocalDB, globalHash: string, sessionHash: string, moduleTypes: {
        [key: string]: typeof Module;
    }): Promise<void>;
    /**
     *
     *
     * @memberof Session
     */
    final(): Promise<void>;
    /**
     *
     *
     * @static
     * @param {(session: Session) => {}} func
     * @memberof Session
     */
    static addRequest(func: (session: Session) => {}): void;
    /**
     *
     *
     * @returns {string}
     * @memberof Session
     */
    getSessionHash(): string;
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
    setSessionHash(hash: string): void;
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
    getGlobalHash(): string;
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
    setGlobalHash(hash: string): void;
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
    setResult(value: string): string;
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof Session
     */
    setValue(name: string, value: any): void;
    /**
     *
     *
     * @param {string} name
     * @returns
     * @memberof Session
     */
    getValue(name: string): any;
    /**
     *
     *
     * @param {string} name
     * @param {*} value
     * @memberof Session
     */
    setGlobalItem(name: string, value: any): void;
    getGlobalItem(name: string, defValue?: any): any;
    setSessionItem(name: string, value: any): void;
    getSessionItem(name: string, defValue?: any): any;
    getModuleType<T extends typeof Module>(name: any): T;
    getModule<T extends Module>(constructor: {
        new (): T;
    }): Promise<T>;
    releaseModules(): Promise<void>;
    request(): Promise<void>;
}
