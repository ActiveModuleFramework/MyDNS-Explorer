/**
 *MyDNSドメイン情報
 *
 * @interface MyDNSDomainInfo
 */
interface MyDNSDomainInfo {
    domainname: string;
    update: Date;
    ipV4: string;
    ipV6: string;
    mx: string[];
    prio: number[];
    hostname: string[];
    type: string[];
    content: string[];
    delegateid: string[];
}
/**
 *MyDNS子アカウント情報
 *
 * @interface MyDNSChildInfo
 */
interface MyDNSChildInfo {
    masterid: string[];
    domainname: string[];
    ipv4addr: string[];
    ipv6addr: string[];
    iplastdate: Date[];
}
/**
 *MyDNS情報統合用
 *
 * @interface MyDNSInfo
 */
interface MyDNSInfo {
    domainInfo: MyDNSDomainInfo;
    childInfo: MyDNSChildInfo;
}
/**
 *MyDNS情報取得用クラス
 *
 * @export
 * @class MyDNSReader
 */
export declare class MyDNSReader {
    mJar: any;
    /**
     *ログインとセッション情報の取得
     *
     * @param {string} id   MyDNSのID
     * @param {string} pass MyDNSのパスワード
     * @returns {Promise<boolean>}
     * @memberof MyDNSReader
     */
    getSession(id: string, pass: string): Promise<boolean>;
    /**
     *MyDNSの情報を取得
     *
     * @returns {Promise<MyDNSInfo>}
     * @memberof MyDNSReader
     */
    getInfo(): Promise<MyDNSInfo>;
    /**
     *MyDNSの子アカウント情報の取得
     *
     * @returns {Promise<MyDNSChildInfo>}
     * @memberof MyDNSReader
     */
    getChildInfo(): Promise<MyDNSChildInfo>;
    /**
     *MyDNSドメイン情報の取得
     *
     * @returns {Promise<MyDNSDomainInfo>}
     * @memberof MyDNSReader
     */
    getDomainInfo(): Promise<MyDNSDomainInfo>;
    /**
     *ドメイン情報パラメータ解析
     *
     * @private
     * @static
     * @param {JSDOM} dom
     * @returns {MyDNSDomainInfo}
     * @memberof MyDNSReader
     */
    private static getParams;
    /**
     *MyDNS情報設定
     *
     * @param {MyDNSDomainInfo} params
     * @returns {Promise<boolean>}
     * @memberof MyDNSReader
     */
    setSetting(params: MyDNSDomainInfo): Promise<boolean>;
}
export {};
