"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework/Manager");
const params = {
    remotePath: '/',
    execPath: '/',
    rootPath: 'public',
    cssPath: ['css'],
    jsPath: ['js'],
    localDBPath: 'db/app.db',
    modulePath: 'app/modules',
    jsPriority: ['jsw.js'],
    debug: true,
    //listen: 8000				//受付ポート/UNIXドメインソケット
    listen: 'sock/app.sock'
};
new amf.Manager(params);
//# sourceMappingURL=index.js.map