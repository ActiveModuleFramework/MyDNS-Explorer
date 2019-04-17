import { Manager } from './Manager';
import { Session } from './Session';
/**
 *モジュール作成用基本クラス
 *
 * @export
 * @class Module
 */
export declare class Module {
    static manager: Manager;
    session: Session;
    static setManager(manager: Manager): void;
    static getManager(): Manager;
    static onCreateModule(): Promise<boolean>;
    static onDestroyModule(): Promise<boolean>;
    static getLocalDB(): import("./LocalDB").LocalDB;
    static output(msg: string, ...params: any[]): void;
    setSession(session: Session): void;
    onStartSession(): Promise<void>;
    onEndSession(): Promise<void>;
    getSession(): Session;
    getGlobalItem(name: string): any;
    setGlobalItem(name: string, value: any): void;
    getSessionItem(name: string): any;
    setSessionItem(name: string, value: any): void;
    getModule<T extends Module>(constructor: {
        new (): T;
    }): Promise<T>;
}
