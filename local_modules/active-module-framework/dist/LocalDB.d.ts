import { ItemDB } from './ItemDB';
/**
 *ローカルDB制御用クラス
 *
 * @export
 * @class LocalDB
 * @extends {ItemDB}
 */
export declare class LocalDB extends ItemDB {
    /**
     *
     *
     * @memberof LocalDB
     */
    initDB(): Promise<void>;
    /**
     *
     *
     * @param {string} hash
     * @param {number} expire
     * @returns {Promise<{ hash: string, values: { [key: string]: any }}>}
     * @memberof LocalDB
     */
    startSession(hash: string, expire: number): Promise<{
        hash: string;
        values: {
            [key: string]: any;
        };
    }>;
    /**
     *
     *
     * @param {string} hash
     * @param {{[key:string]:any}} values
     * @returns
     * @memberof LocalDB
     */
    endSession(hash: string, values: {
        [key: string]: any;
    }): Promise<boolean>;
    /**
     *
     *
     * @returns
     * @memberof LocalDB
     */
    createSession(): Promise<any>;
}
