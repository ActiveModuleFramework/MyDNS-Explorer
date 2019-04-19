/// <reference path="jsw.d.ts" />
interface UserInfo {
    no: number;
    type: string;
    id: string;
    name: string;
    admin: boolean;
}
declare class AppManager {
    adapter: JSW.Adapter;
    mainWindow: JSW.Window;
    topPanel: TopPanel;
    userInfo: UserInfo;
    loginButton: TopButton;
    usersButton: TopButton;
    constructor();
    init(): void;
    request(): Promise<UserInfo>;
    private login;
    private showLoginView;
    private setUserName;
    private createPanel;
}
interface TopButton extends HTMLDivElement {
    setText(text: string): void;
}
declare class TopPanel extends JSW.Window {
    constructor();
    createButton(imageURL: string, title: string, text?: string): TopButton;
}
declare class MainView extends JSW.Window {
    adapter: JSW.Adapter;
    treeView: JSW.TreeView;
    listView: JSW.ListView;
    constructor(adapter: JSW.Adapter);
    update(): Promise<void>;
    getDNSParent(infos: {
        [keys: string]: MyDNSInfo;
    }, id: string): string;
    addTreeChild(item: JSW.TreeItem, info: any, infos: {
        [keys: string]: MyDNSInfo;
    }): void;
    outputInfo(value: any): void;
}
declare class MyDNSEditWindow extends JSW.FrameWindow {
    enter(adapter: JSW.Adapter): Promise<{}>;
}
interface MyDNSDomainInfo {
    domainname: string;
    update: string;
    ipV4: string;
    ipV6: string;
    mx: string[];
    prio: number[];
    hostname: string[];
    type: string[];
    content: string[];
    delegateid: string[];
}
interface MyDNSChildInfo {
    masterid: string[];
    domainname: string[];
    ipv4addr: string[];
    ipv6addr: string[];
    iplastdate: string[];
}
interface MyDNSInfo {
    domainInfo: MyDNSDomainInfo;
    childInfo: MyDNSChildInfo;
}
declare class MyDNSUserWindow extends JSW.Window {
    listView: JSW.ListView;
    adapter: JSW.Adapter;
    constructor(adapter: JSW.Adapter);
    update(): Promise<void>;
}
declare class UserListWindow extends JSW.Window {
    adapter: JSW.Adapter;
    listView: JSW.ListView;
    constructor(adapter: JSW.Adapter);
    getUsers(): Promise<UserInfo[]>;
}
declare class UserEditView extends JSW.FrameWindow {
    setUser(adapter: JSW.Adapter, no?: number, id?: string, name?: string, pass?: string): Promise<boolean>;
}
declare class LoginWindow extends JSW.FrameWindow {
    login(adapter: JSW.Adapter): Promise<UserInfo>;
}
declare function Main(): Promise<void>;
