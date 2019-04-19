import { Manager } from './Manager'
import { Session } from './Session'
/**
 *モジュール作成用基本クラス
 *
 * @export
 * @class Module
 */
export class AmfModule {
	static manager: Manager
	session: Session
	public static setManager(manager: Manager) { AmfModule.manager = manager; }
	public static getManager(): Manager { return AmfModule.manager }
	public static async onCreateModule(): Promise<boolean> { return true }
	public static async onDestroyModule(): Promise<boolean> { return true }
	public static getLocalDB() { return AmfModule.manager.getLocalDB() }
	public static output(msg: string, ...params) { AmfModule.manager.output(msg, ...params) }
	public setSession(session: Session): void { this.session = session; }
	public async onStartSession(): Promise<void> { }
	public async onEndSession(): Promise<void> { }
	public getSession(): Session { return this.session; }
	public getGlobalItem(name: string): any { return this.session.getGlobalItem(name) }
	public setGlobalItem(name: string, value): void { this.session.setGlobalItem(name, value) }
	public getSessionItem(name: string): any { return this.session.getSessionItem(name) }
	public setSessionItem(name: string, value): void { this.session.setSessionItem(name, value) }
	public getModule<T extends AmfModule>(constructor: { new(): T }): Promise<T> { return this.session.getModule(constructor) }


}