"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const jsdom_1 = require("jsdom");
/**
 *MyDNS情報取得用クラス
 *
 * @export
 * @class MyDNSReader
 */
class MyDNSReader {
    constructor() {
        this.mJar = request.jar();
    }
    /**
     *ログインとセッション情報の取得
     *
     * @param {string} id   MyDNSのID
     * @param {string} pass MyDNSのパスワード
     * @returns {Promise<boolean>}
     * @memberof MyDNSReader
     */
    async getSession(id, pass) {
        var options = {
            jar: this.mJar,
            url: "https://www.mydns.jp/",
            method: "POST",
            transform: (body, response) => {
                return { headers: response.headers, body: body };
            },
            form: {
                MENU: 100,
                masterid: id,
                masterpwd: pass
            }
        };
        let value = (await request(options).catch(() => null));
        if (value && value.body && value.body.indexOf("./?MENU=090") >= 0) {
            return true;
        }
        return false;
    }
    /**
     *MyDNSの情報を取得
     *
     * @returns {Promise<MyDNSInfo>}
     * @memberof MyDNSReader
     */
    async getInfo() {
        const childInfo = this.getChildInfo();
        const domainInfo = this.getDomainInfo();
        const values = await Promise.all([childInfo, domainInfo]).catch(() => {
            return null;
        });
        if (values === null || values[0] === null || values[1] === null)
            return null;
        return { childInfo: values[0], domainInfo: values[1] };
    }
    /**
     *MyDNSの子アカウント情報の取得
     *
     * @returns {Promise<MyDNSChildInfo>}
     * @memberof MyDNSReader
     */
    async getChildInfo() {
        var options = {
            jar: this.mJar,
            url: "https://www.mydns.jp/",
            method: "GET",
            qs: { MENU: "200" }
        };
        let value = null;
        for (let i = 0; i < 5 && value === null; i++)
            value = await request(options).catch(() => null);
        if (value === null)
            return null;
        const info = {
            masterid: [],
            domainname: [],
            ipv4addr: [],
            ipv6addr: [],
            iplastdate: []
        };
        const dom = new jsdom_1.JSDOM(value);
        const doc = dom.window.document;
        for (let i = 0;; i++) {
            const idElement = doc.querySelector(`INPUT[NAME="CHILDINFO[masterid][${i}]"]`);
            if (!idElement)
                break;
            info.masterid[i] = idElement.value;
            const domainElement = doc.querySelector(`INPUT[NAME="CHILDINFO[domainname][${i}]"]`);
            info.domainname[i] = domainElement.value;
            const ipv4Element = doc.querySelector(`INPUT[NAME="CHILDINFO[ipv4addr][${i}]"]`);
            info.ipv4addr[i] = ipv4Element.value;
            const ipv6lement = doc.querySelector(`INPUT[NAME="CHILDINFO[ipv6addr][${i}]"]`);
            info.ipv6addr[i] = ipv6lement.value;
            const updateElement = doc.querySelector(`INPUT[NAME="CHILDINFO[iplastdate][${i}]"]`);
            info.iplastdate[i] = new Date(updateElement.value);
        }
        return info;
    }
    /**
     *MyDNSドメイン情報の取得
     *
     * @returns {Promise<MyDNSDomainInfo>}
     * @memberof MyDNSReader
     */
    async getDomainInfo() {
        var options = {
            jar: this.mJar,
            url: "https://www.mydns.jp/",
            method: "GET",
            qs: { MENU: "300" }
        };
        let value = null;
        for (let i = 0; i < 5 && value === null; i++)
            value = await request(options).catch(() => null);
        if (value === null)
            return null;
        return MyDNSReader.getParams(new jsdom_1.JSDOM(value));
    }
    /**
     *ドメイン情報パラメータ解析
     *
     * @private
     * @static
     * @param {JSDOM} dom
     * @returns {MyDNSDomainInfo}
     * @memberof MyDNSReader
     */
    static getParams(dom) {
        try {
            let params = {
                domainname: "",
                update: null,
                ipV4: null,
                ipV6: null,
                mx: [],
                prio: [],
                hostname: [],
                type: [],
                content: [],
                delegateid: []
            };
            const doc = dom.window.document;
            const ipAddress = doc.querySelector("FONT.userinfo12");
            const ipText = ipAddress.textContent || "";
            const ip = ipText.match(/IPv4\(A\):([\d\.]*?), IPv6\(AAAA\):(.*?)\. (?:Last IP notify:(.*)|Please)/);
            if (ip) {
                if (ip.length >= 3) {
                    params.ipV4 = ip[1];
                    params.ipV6 = ip[2];
                }
                if (ip.length === 4) {
                    if (ip[3])
                        params.update = ip[3] ? new Date(ip[3]) : null;
                }
            }
            const domainName = doc.querySelector('INPUT[name="DNSINFO[domainname]"]');
            params.domainname = domainName.value;
            for (let i = 0;; i++) {
                const mx = doc.querySelector(`INPUT[name="DNSINFO[mx][${i}]"]`);
                if (!mx)
                    break;
                params.mx[i] = mx.value;
                const prio = doc.querySelector(`SELECT[name="DNSINFO[prio][${i}]"]`);
                params.prio[i] = parseInt(prio.value);
            }
            for (let i = 0;; i++) {
                const hostname = doc.querySelector(`INPUT[name="DNSINFO[hostname][${i}]"]`);
                if (!hostname)
                    break;
                params.hostname[i] = hostname.value;
                const type = doc.querySelector(`SELECT[name="DNSINFO[type][${i}]"]`);
                params.type[i] = type.value;
                const content = doc.querySelector(`INPUT[name="DNSINFO[content][${i}]"]`);
                params.content[i] = content.value;
                const delegateid = doc.querySelector(`SELECT[name="DNSINFO[delegateid][${i}]"]`);
                params.delegateid[i] = delegateid.value;
            }
            return params;
        }
        catch (e) {
            return null;
        }
    }
    /**
     *MyDNS情報設定
     *
     * @param {MyDNSDomainInfo} params
     * @returns {Promise<boolean>}
     * @memberof MyDNSReader
     */
    async setSetting(params) {
        const options = {
            jar: this.mJar,
            url: "https://www.mydns.jp/",
            method: "POST",
            form: {
                MENU: 300,
                JOB: "CHECK"
            }
        };
        const form = options.form;
        form["DNSINFO[domainname]"] = params.domainname;
        for (let i = 0; params.mx[i]; i++) {
            form[`DNSINFO[mx][${i}]`] = params.mx[i];
            form[`DNSINFO[prio][${i}]`] = params.prio[i];
        }
        for (let i = 0; params.hostname[i]; i++) {
            form[`DNSINFO[hostname][${i}]`] = params.hostname[i];
            form[`DNSINFO[type][${i}]`] = params.type[i];
            form[`DNSINFO[content][${i}]`] = params.content[i];
            form[`DNSINFO[delegateid][${i}]`] = params.delegateid[i];
        }
        let value = await request(options).catch(() => null);
        if (value &&
            value.indexOf('<INPUT type="hidden" name="JOB" value="CHANGE">') >= 0) {
            const options = {
                jar: this.mJar,
                url: "https://www.mydns.jp/",
                method: "POST",
                form: {
                    MENU: 300,
                    JOB: "CHANGE"
                }
            };
            let value = await request(options).catch(() => null);
            if (value && value.indexOf("We accepted your Domain") >= 0)
                return true;
        }
        return false;
    }
}
exports.MyDNSReader = MyDNSReader;
//# sourceMappingURL=MyDNSReader.js.map