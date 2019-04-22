"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amf = require("active-module-framework");
new amf.Manager({
    remotePath: '/',
    execPath: '/',
    rootPath: 'public',
    cssPath: ['css'],
    jsPath: ['js'],
    localDBPath: 'db/app.db',
    modulePath: 'app/modules',
    jsPriority: ['jsw.js'],
    debug: true,
    listen: 8000 //受付ポート/UNIXドメインソケット
    //listen:'sock/app.sock'
});
//# sourceMappingURL=index.js.map