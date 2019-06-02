import * as JWF from "javascript-window-framework";
import { MainView } from "./MainView";
import { UserInfo, UserListWindow, UserEditView, LoginWindow } from "./Users";
import { MyDNSUserWindow } from "./MyDNS";
import { TopPanel, TopButton } from "./TopPanel";

const USER_SVG = require("./scss/main/user.svg");
const USERS_SVG = require("./scss/main/users.svg");
const DNS_SVG = require("./scss/main/dns.svg");

/**
 *アプリケーション全体の管理クラス
 *
 * @export
 * @class AppManager
 */
export class AppManager {
  adapter: JWF.Adapter;
  mainWindow: JWF.Window;
  mainView: MainView;
  topPanel: TopPanel;
  userInfo?: UserInfo;
  loginButton: TopButton;
  usersButton: TopButton;
  /**
   *Creates an instance of AppManager.
   * @memberof AppManager
   */
  constructor() {
    //通信アダプタの作成
    this.adapter = new JWF.Adapter("./");
    //アプリケーションのメインウインドウの作成
    this.mainWindow = new JWF.Window();
    this.mainWindow.setOverlap(true);
    this.mainWindow.setMaximize(true);
    //画面上部の操作パネルの作成
    this.topPanel = new TopPanel();
    this.mainWindow.addChild(this.topPanel, "top");

    this.loginButton = this.topPanel.createButton(USER_SVG, "ログイン");
    this.loginButton.addEventListener("click", () => {
      this.showLoginView();
    });
    this.usersButton = this.topPanel.createButton(
      USERS_SVG,
      "ローカル\nユーザ管理",
      "ローカル\nユーザ管理"
    );
    this.usersButton.addEventListener("click", () => {
      const userListWindow = new UserListWindow(this.adapter);
      userListWindow.setOverlap(false);
      this.mainWindow.addChild(userListWindow, "client");
    });
    const dnsButton = this.topPanel.createButton(
      DNS_SVG,
      "DNS\nユーザ管理",
      "DNS\nユーザ管理"
    );
    dnsButton.addEventListener("click", () => {
      const dnsUserWindow = new MyDNSUserWindow(this.adapter);
      this.mainWindow.addChild(dnsUserWindow, "client");
    });

    //セッションとユーザ情報の処理要求
    this.request();
    //メイン画面の作成
    const mainView = new MainView(this.adapter);
    this.mainWindow.addChild(mainView, "client");
    this.mainView = mainView;
  }

  /**
   *セッションログイン処理
   *
   * @returns
   * @memberof AppManager
   */
  async request() {
    //ユーザ情報の要求
    const user = (await this.adapter.exec("Users.request")) as UserInfo;
    if (user) {
      this.userInfo = user;
      //ログイン後の処理要求
      this.logined();
    }
    return user;
  }
  /**
   *ログイン後の処理
   *
   * @private
   * @memberof AppManager
   */
  private logined() {
    if (!this.userInfo) return;
    this.setUserName(this.userInfo.name);

    if (this.userInfo.no === 0 && this.userInfo.admin) {
      (async () => {
        const userEditView = new UserEditView();
        const flag = await userEditView.setUser(
          this.adapter,
          0,
          "admin",
          "ローカル管理者"
        );
        if (flag) {
          const user = await this.request();
          const id = userEditView.getUserId();
          const pass = userEditView.getUserPass();
          if (user.no === -1 && id && pass) this.showLoginView(id, pass, true);
        }
      })();
    }
  }
  /**
   *ログイン用ウインドウの表示
   *
   * @private
   * @param {string} [userId]
   * @param {string} [userPass]
   * @param {boolean} [local]
   * @memberof AppManager
   */
  private async showLoginView(
    userId?: string,
    userPass?: string,
    local?: boolean
  ) {
    const loginView = new LoginWindow();
    const user = await loginView.login(this.adapter, userId, userPass, local);
    if (user) {
      this.userInfo = user;
      this.logined();
      this.mainView.update();
    }
  }
  /**
   *ユーザ名の設定
   *
   * @private
   * @param {*} name
   * @memberof AppManager
   */
  private setUserName(name: string) {
    this.loginButton.setText(name);
  }
}
