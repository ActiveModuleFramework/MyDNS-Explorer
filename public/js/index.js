var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AppManager = /** @class */ (function () {
    function AppManager() {
        this.init();
    }
    AppManager.prototype.init = function () {
        this.adapter = new JSW.Adapter('./');
        this.mainWindow = new JSW.Window();
        this.mainWindow.setOverlap(true);
        this.mainWindow.setMaximize(true);
        this.createPanel();
        this.request();
        var mainView = new MainView(this.adapter);
        this.mainWindow.addChild(mainView, 'client');
        this.mainView = mainView;
    };
    AppManager.prototype.request = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.exec('Users.request')];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            this.userInfo = user;
                            this.logined();
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AppManager.prototype.logined = function () {
        var _this = this;
        this.setUserName(this.userInfo.name);
        if (this.userInfo.no === 0 && this.userInfo.admin) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var userEditView, flag, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userEditView = new UserEditView();
                            return [4 /*yield*/, userEditView.setUser(this.adapter, 0, 'admin', 'ローカル管理者')];
                        case 1:
                            flag = _a.sent();
                            if (!flag) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.request()];
                        case 2:
                            user = _a.sent();
                            if (user.no === -1)
                                this.showLoginView(userEditView.getUserId(), userEditView.getUserPass(), true);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        }
    };
    AppManager.prototype.showLoginView = function (userId, userPass, local) {
        return __awaiter(this, void 0, void 0, function () {
            var loginView, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginView = new LoginWindow();
                        return [4 /*yield*/, loginView.login(this.adapter, userId, userPass, local)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            this.userInfo = user;
                            this.logined();
                            this.mainView.update();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AppManager.prototype.setUserName = function (name) {
        this.loginButton.setText(name);
    };
    AppManager.prototype.createPanel = function () {
        var _this = this;
        this.topPanel = new TopPanel();
        this.mainWindow.addChild(this.topPanel, 'top');
        this.loginButton = this.topPanel.createButton('./css/main/user.svg', 'ログイン');
        this.loginButton.
            addEventListener('click', function () {
            _this.showLoginView();
        });
        this.usersButton = this.topPanel.createButton('./css/main/users.svg', 'ローカル\nユーザ管理', 'ローカル\nユーザ管理');
        this.usersButton.
            addEventListener('click', function () {
            var userListWindow = new UserListWindow(_this.adapter);
            userListWindow.setOverlap(false);
            _this.mainWindow.addChild(userListWindow, 'client');
        });
        var dnsButton = this.topPanel.createButton('./css/main/dns.svg', 'DNS\nユーザ管理', 'DNS\nユーザ管理');
        dnsButton.
            addEventListener('click', function () {
            var dnsUserWindow = new MyDNSUserWindow(_this.adapter);
            _this.mainWindow.addChild(dnsUserWindow, 'client');
        });
    };
    return AppManager;
}());
var TopPanel = /** @class */ (function (_super) {
    __extends(TopPanel, _super);
    function TopPanel() {
        var _this = _super.call(this) || this;
        _this.setHeight(80);
        var client = _this.getClient();
        client.dataset.style = 'TOP';
        return _this;
    }
    TopPanel.prototype.createButton = function (imageURL, title, text) {
        var buttonNode = document.createElement('div');
        var imageNode = document.createElement('img');
        var textNode = document.createElement('div');
        buttonNode.appendChild(imageNode);
        buttonNode.appendChild(textNode);
        imageNode.src = imageURL;
        imageNode.title = title;
        if (text)
            textNode.innerText = text;
        buttonNode.setText = function (text) {
            textNode.innerText = text;
        };
        this.getClient().appendChild(buttonNode);
        return buttonNode;
    };
    return TopPanel;
}(JSW.Window));
var MainView = /** @class */ (function (_super) {
    __extends(MainView, _super);
    function MainView(adapter) {
        var _this = _super.call(this) || this;
        _this.adapter = adapter;
        var split = new JSW.Splitter();
        _this.addChild(split, 'client');
        var panel = new JSW.Panel();
        split.addChild(0, panel, 'top');
        var button = new JSW.Button('表示更新');
        panel.addChild(button, 'left');
        button.addEventListener('buttonClick', function () { _this.update(); });
        var button2 = new JSW.Button('データ更新');
        panel.addChild(button2, 'left');
        button2.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
            var msgBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgBox = new JSW.MessageBox('データ更新', '更新中');
                        return [4 /*yield*/, adapter.exec('MyDNS.update')];
                    case 1:
                        if (_a.sent()) {
                            msgBox.close();
                            this.update();
                        }
                        else {
                            msgBox.setText('更新失敗');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        var tree = new JSW.TreeView();
        _this.treeView = tree;
        split.addChild(0, tree, 'client');
        split.setSplitterPos(300);
        split.setOverlay(true, 400);
        tree.addEventListener('itemSelect', function (e) { _this.outputInfo(e.item.getItemValue()); });
        tree.addEventListener('itemDblClick', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var item, id, result, win;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = e.item;
                        id = item.getItemValue()[0];
                        return [4 /*yield*/, this.adapter.exec('MyDNS.getPassword', id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            win = window.open('', '_blank');
                            win.document.open();
                            win.document.write("\n\t\t\t\t<html><body>\n\t\t\t\t<form name='mydns' action='https://www.mydns.jp' method='post'>\n\t\t\t\t<input type='hidden' name='masterid' value='" + id + "'>\n\t\t\t\t<input type='hidden' name='masterpwd' value='" + result.pass + "'>\n\t\t\t\t<input type='hidden' name='MENU' value='100'>\n\t\t\t\t</form>\n\t\t\t\t<script>document.mydns.submit()</script>\n\t\t\t\t");
                            win.document.close();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        var list = new JSW.ListView();
        _this.listView = list;
        split.addChild(1, list, 'client');
        list.addHeader(['項目', ['DATA1', 200], ['DATA2', 150], 'DATA3']);
        _this.update();
        return _this;
    }
    MainView.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, infos, _i, results_1, result, info, topInfos, key, pid, treeView, key, info, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.exec('MyDNS.getUsers')
                        //IDごとに情報を展開
                    ];
                    case 1:
                        results = _a.sent();
                        infos = {};
                        if (results) {
                            for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                                result = results_1[_i];
                                info = result.info;
                                infos[result.id] = info;
                            }
                        }
                        topInfos = {};
                        for (key in infos) {
                            pid = this.getDNSParent(infos, key);
                            if (pid === null)
                                topInfos[key] = infos[key];
                        }
                        treeView = this.treeView;
                        treeView.clearItem();
                        treeView.getRootItem().setItemText('DNS Tree');
                        for (key in topInfos) {
                            info = topInfos[key];
                            item = treeView.addItem(info.domainInfo.domainname + " (" + key + ")", true);
                            item.setItemValue([key, info]);
                            this.addTreeChild(item, info, infos);
                        }
                        this.listView.clearItem();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainView.prototype.getDNSParent = function (infos, id) {
        for (var key in infos) {
            var info = infos[key];
            var childInfo = info.childInfo;
            for (var _i = 0, _a = childInfo.masterid; _i < _a.length; _i++) {
                var cid = _a[_i];
                if (id === cid)
                    return key;
            }
        }
        return null;
    };
    MainView.prototype.addTreeChild = function (item, info, infos) {
        var childInfo = info.childInfo;
        for (var _i = 0, _a = childInfo.masterid; _i < _a.length; _i++) {
            var cid = _a[_i];
            var cinfo = infos[cid];
            if (cinfo) {
                var citem = item.addItem(cinfo.domainInfo.domainname + " (" + cid + ")", true);
                citem.setItemValue([cid, cinfo]);
                this.addTreeChild(citem, cinfo, infos);
            }
        }
    };
    MainView.prototype.outputInfo = function (value) {
        if (!value)
            return;
        var id = value[0];
        var info = value[1];
        var domainInfo = info.domainInfo;
        //const childInfo = info.childInfo
        var listView = this.listView;
        listView.clearItem();
        listView.addItem(['ID', id]);
        listView.addItem(['UPDATE', (new Date(domainInfo.update)).toLocaleString()]);
        listView.addItem(['IPv4', domainInfo.ipV4]);
        listView.addItem(['IPv6', domainInfo.ipV6]);
        listView.addItem(['DOMAIN', domainInfo.domainname]);
        for (var index in domainInfo.mx) {
            if (domainInfo.mx[index])
                listView.addItem(['RECORD', domainInfo.mx[index], 'MX', domainInfo.prio[index]]);
        }
        for (var index in domainInfo.type) {
            if (domainInfo.hostname[index])
                listView.addItem(['RECORD', domainInfo.hostname[index], domainInfo.type[index], domainInfo.content[index] || domainInfo.delegateid[index]]);
        }
    };
    return MainView;
}(JSW.Window));
var MyDNSEditWindow = /** @class */ (function (_super) {
    __extends(MyDNSEditWindow, _super);
    function MyDNSEditWindow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyDNSEditWindow.prototype.enter = function (adapter) {
        var _this = this;
        this.setSize(300, 200);
        this.setTitle('MyDNS ユーザの追加');
        this.setPadding(10, 10, 10, 10);
        var textUserID = new JSW.TextBox({ label: 'ユーザID', image: './css/images/login_id.svg' });
        this.addChild(textUserID, 'top');
        textUserID.setMargin(0, 0, 0, 10);
        var textUserPass = new JSW.TextBox({ label: 'パスワード', type: 'password', image: './css/images/login_pass.svg' });
        textUserPass.setMargin(0, 10, 0, 10);
        this.addChild(textUserPass, 'top');
        var addLogin = new JSW.Button('追加');
        addLogin.setMargin(0, 10, 0, 5);
        addLogin.setAlign('center');
        this.addChild(addLogin, 'top');
        var msgLabel = new JSW.Label('入力待ち');
        msgLabel.setAlign('center');
        this.addChild(msgLabel, 'top');
        this.setPos();
        this.active();
        return new Promise(function (resolv) {
            _this.addEventListener('closed', function () {
                resolv(null);
            });
            addLogin.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msgLabel.setText('ID確認中');
                            return [4 /*yield*/, adapter.exec('MyDNS.addUser', textUserID.getText(), textUserPass.getText())];
                        case 1:
                            info = _a.sent();
                            if (!info) return [3 /*break*/, 3];
                            resolv(info);
                            msgLabel.setText('追加成功');
                            return [4 /*yield*/, JSW.Sleep(500)];
                        case 2:
                            _a.sent();
                            this.close();
                            return [3 /*break*/, 4];
                        case 3:
                            msgLabel.setText('追加失敗');
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return MyDNSEditWindow;
}(JSW.FrameWindow));
var MyDNSUserWindow = /** @class */ (function (_super) {
    __extends(MyDNSUserWindow, _super);
    function MyDNSUserWindow(adapter) {
        var _this = _super.call(this, { frame: true, overlap: false }) || this;
        _this.adapter = adapter;
        _this.setTitle('DNSユーザ管理');
        var panel = new JSW.Panel();
        _this.addChild(panel, 'top');
        var addButton = new JSW.Button('追加', 'add');
        panel.addChild(addButton, 'left');
        var delButton = new JSW.Button('削除', 'del');
        panel.addChild(delButton, 'left');
        var listView = new JSW.ListView();
        _this.listView = listView;
        _this.addChild(listView, 'client');
        listView.addHeader([['ID', 150], ['UPDATE', 200], ['IP', 150], 'DOMAIN']);
        addButton.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
            var userEditView, flag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userEditView = new MyDNSEditWindow();
                        return [4 /*yield*/, userEditView.enter(adapter)];
                    case 1:
                        flag = _a.sent();
                        if (flag) {
                            this.update();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        delButton.addEventListener('buttonClick', function () {
            var values = _this.listView.getSelectValues();
            if (values.length) {
                var userInfo_1 = values[0];
                var messageBox = new JSW.MessageBox('確認', "[" + userInfo_1.id + "]\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", { 'OK': true, 'Cancel': false });
                messageBox.addEventListener('buttonClick', function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!value) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.adapter.exec('MyDNS.delUser', userInfo_1.id)];
                            case 1:
                                if (_a.sent()) {
                                    this.update();
                                }
                                else {
                                    new JSW.MessageBox('エラー', "\u524A\u9664\u5931\u6557");
                                }
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            }
        });
        _this.update();
        _this.active();
        return _this;
    }
    MyDNSUserWindow.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, listView, _i, results_2, result, info, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.exec('MyDNS.getUsers')];
                    case 1:
                        results = _a.sent();
                        if (results) {
                            listView = this.listView;
                            listView.clearItem();
                            for (_i = 0, results_2 = results; _i < results_2.length; _i++) {
                                result = results_2[_i];
                                info = result.info;
                                update = info.domainInfo.update ? (new Date(info.domainInfo.update)).toLocaleString() : '';
                                listView.addItem([result.id, update, info.domainInfo.ipV4, info.domainInfo.domainname], result);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return MyDNSUserWindow;
}(JSW.Window));
/// <reference path="../../public/js/jsw.d.ts" />
var UserListWindow = /** @class */ (function (_super) {
    __extends(UserListWindow, _super);
    function UserListWindow(adapter) {
        var _this = _super.call(this, { frame: true, overlap: false }) || this;
        _this.adapter = adapter;
        _this.setTitle('ユーザリスト(ローカル)');
        var panel = new JSW.Panel();
        _this.addChild(panel, 'top');
        var addButton = new JSW.Button('追加');
        panel.addChild(addButton, 'left');
        addButton.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
            var userEditView, flag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userEditView = new UserEditView();
                        return [4 /*yield*/, userEditView.setUser(adapter)];
                    case 1:
                        flag = _a.sent();
                        if (flag) {
                            this.getUsers();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        var delButton = new JSW.Button('削除');
        panel.addChild(delButton, 'left');
        delButton.addEventListener('buttonClick', function () {
            var values = _this.listView.getSelectValues();
            if (values.length) {
                var userInfo_2 = values[0];
                var messageBox = new JSW.MessageBox('確認', "[" + userInfo_2.name + "]\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", { 'OK': true, 'Cancel': false });
                messageBox.addEventListener('buttonClick', function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!value) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.adapter.exec('Users.delUser', userInfo_2.no, true)];
                            case 1:
                                if (_a.sent()) {
                                    this.getUsers();
                                }
                                else {
                                    new JSW.MessageBox('エラー', "\u524A\u9664\u5931\u6557");
                                }
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            }
        });
        var list = new JSW.ListView();
        _this.addChild(list, 'client');
        _this.listView = list;
        list.addHeader(['NO', ['ID', 100], 'NAME']);
        list.setColumnStyles(['right']);
        list.addEventListener('itemDblClick', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var user, userEditView, flag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = list.getItemValue(e.itemIndex);
                        userEditView = new UserEditView();
                        return [4 /*yield*/, userEditView.setUser(adapter, user.no, user.id, user.name)];
                    case 1:
                        flag = _a.sent();
                        if (flag) {
                            this.getUsers();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        _this.getUsers();
        _this.active();
        return _this;
    }
    UserListWindow.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, listView, _i, users_1, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.exec('Users.getUsers', true)];
                    case 1:
                        users = _a.sent();
                        if (users) {
                            listView = this.listView;
                            listView.clearItem();
                            for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                                user = users_1[_i];
                                listView.addItem([user.no, user.id, user.name], user);
                            }
                        }
                        return [2 /*return*/, users];
                }
            });
        });
    };
    return UserListWindow;
}(JSW.Window));
var UserEditView = /** @class */ (function (_super) {
    __extends(UserEditView, _super);
    function UserEditView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserEditView.prototype.setUser = function (adapter, no, id, name, pass) {
        var _this = this;
        this.setTitle('ユーザの追加');
        this.setPos();
        this.setPadding(10, 10, 10, 10);
        var textUserID = new JSW.TextBox({
            label: 'ユーザID', text: id || '',
            image: './css/images/login_id.svg'
        });
        this.addChild(textUserID, 'top');
        textUserID.setMargin(0, 0, 0, 10);
        this.textUserID = textUserID;
        var textUserName = new JSW.TextBox({
            label: 'ユーザ名(省略時ユーザID)', text: name || '',
            image: './css/images/login_id.svg'
        });
        this.addChild(textUserName, 'top');
        textUserName.setMargin(0, 0, 0, 10);
        var textUserPass = new JSW.TextBox({
            label: 'パスワード(入力無しは無変更)', type: 'password', text: pass || '',
            image: './css/images/login_pass.svg'
        });
        textUserPass.setMargin(0, 10, 0, 10);
        this.addChild(textUserPass, 'top');
        this.textUserPass = textUserPass;
        var button = new JSW.Button(no ? '変更' : '追加');
        button.setMargin(0, 10, 0, 5);
        button.setAlign('center');
        this.addChild(button, 'top');
        var msgLabel = new JSW.Label('ユーザの追加');
        msgLabel.setAlign('center');
        this.addChild(msgLabel, 'top');
        return new Promise(function (resolv) {
            button.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msgLabel.setText('設定中');
                            return [4 /*yield*/, adapter.exec('Users.setUser', no ? no : 0, textUserID.getText(), textUserName.getText(), textUserPass.getText(), true)];
                        case 1:
                            info = _a.sent();
                            if (!info) return [3 /*break*/, 3];
                            resolv(true);
                            msgLabel.setText('設定成功');
                            return [4 /*yield*/, JSW.Sleep(1000)];
                        case 2:
                            _a.sent();
                            this.close();
                            return [3 /*break*/, 4];
                        case 3:
                            resolv(false);
                            msgLabel.setText('設定失敗');
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    UserEditView.prototype.getUserId = function () {
        return this.textUserID.getText();
    };
    UserEditView.prototype.getUserPass = function () {
        return this.textUserPass.getText();
    };
    return UserEditView;
}(JSW.FrameWindow));
var LoginWindow = /** @class */ (function (_super) {
    __extends(LoginWindow, _super);
    function LoginWindow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginWindow.prototype.login = function (adapter, userId, userPass, local) {
        var _this = this;
        this.setSize(300, 300);
        this.setTitle('ログイン');
        this.setPadding(10, 10, 10, 10);
        var textUserID = new JSW.TextBox({ label: 'ユーザID', image: './css/images/login_id.svg' });
        this.addChild(textUserID, 'top');
        textUserID.setMargin(0, 0, 0, 10);
        if (userId)
            textUserID.setText(userId);
        var textUserPass = new JSW.TextBox({ label: 'パスワード', type: 'password', image: './css/images/login_pass.svg' });
        textUserPass.setMargin(0, 10, 0, 10);
        this.addChild(textUserPass, 'top');
        if (userPass)
            textUserPass.setText(userPass);
        var localCheck = new JSW.CheckBox({ text: "ローカルログイン", checked: true });
        this.addChild(localCheck, 'top');
        if (local)
            localCheck.setCheck(local);
        var keepCheck = new JSW.CheckBox({ text: "ログイン情報の保存" });
        this.addChild(keepCheck, 'top');
        var buttonLogin = new JSW.Button('ログイン');
        buttonLogin.setMargin(0, 10, 0, 5);
        buttonLogin.setAlign('center');
        this.addChild(buttonLogin, 'top');
        var buttonLogout = new JSW.Button('ログアウト');
        buttonLogout.setAlign('center');
        this.addChild(buttonLogout, 'top');
        var msgLabel = new JSW.Label('ログイン入力待ち');
        msgLabel.setAlign('center');
        this.addChild(msgLabel, 'top');
        this.setPos();
        this.active();
        return new Promise(function (resolv) {
            _this.addEventListener('closed', function () {
                resolv(null);
            });
            buttonLogin.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msgLabel.setText('ログイン中');
                            return [4 /*yield*/, adapter.exec('Users.login', textUserID.getText(), textUserPass.getText(), localCheck.isCheck(), keepCheck.isCheck())];
                        case 1:
                            info = _a.sent();
                            if (!info) return [3 /*break*/, 3];
                            resolv(info);
                            msgLabel.setText('認証成功');
                            return [4 /*yield*/, JSW.Sleep(500)];
                        case 2:
                            _a.sent();
                            this.close();
                            return [3 /*break*/, 4];
                        case 3:
                            msgLabel.setText('ログイン失敗');
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            buttonLogout.addEventListener('buttonClick', function () { return __awaiter(_this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msgLabel.setText('ログアウト中');
                            return [4 /*yield*/, adapter.exec('Users.logout')];
                        case 1:
                            info = _a.sent();
                            if (!info) return [3 /*break*/, 3];
                            resolv(info);
                            msgLabel.setText('ログアウト完了');
                            return [4 /*yield*/, JSW.Sleep(500)];
                        case 2:
                            _a.sent();
                            this.close();
                            return [3 /*break*/, 4];
                        case 3:
                            msgLabel.setText('ログアウト失敗');
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return LoginWindow;
}(JSW.FrameWindow));
function Main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            new AppManager();
            return [2 /*return*/];
        });
    });
}
//ページ読み込み時に実行する処理を設定
addEventListener("DOMContentLoaded", Main);
//# sourceMappingURL=index.js.map