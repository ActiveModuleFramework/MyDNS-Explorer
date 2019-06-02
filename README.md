# MyDNS Explorer

## 用途

- アカウントを登録することによって、MyDNSの登録情報を管理します  
親子のIDを登録すると、TreeViewで階層化して表示します  
どのアカウントに何を設定したのかを、すばやく確認可能です  

- 開発中のバックエンド用ActiveModuleFrameworkとフロントエンド用JavaScriptWindowフレームワークを検証するため、  
テスト的に作ってみました  
SPA(SinglePageApplication)を前提とするフレームワークです  

- ダウンロードできるパッケージ版は、Windowsのデスクトップアプリとしてそのまま動作します

## ライセンス
　MITライセンス  
　ソースコードは自由に使って構いませんが、無保証です  

## Download
　[Windows インストーラ版](https://github.com/ActiveModuleFramework/MyDNS-Explorer/raw/bin/MyDNS-Explorer%20Setup%201.0.0.exe)
　[Windows ZIP圧縮版](https://github.com/ActiveModuleFramework/MyDNS-Explorer/raw/bin/MyDNS-Explorer.zip)

## スクリーンショット
![スクリーンショット](https://raw.githubusercontent.com/activemoduleframework/MyDNS-Explorer/sc/ScreenShot01.png)


## ソースからの起動方法(Node.jsプログラムとして)

- バックエンド側
  - 普通に起動
	```
	npm install
	npm start
	```
  - コンパイル
	```
	npm run build-app
	npm run build-front
	```
  - 起動
  	```
	npm start
	```

- フロントエンド側
	```
	http://localhost:58621/
	```

## 動作環境
- 一般的なブラウザ(IE11でも動作可能)

## 使っているもの

- フロントエンドフレームワーク (オレオレフレームワーク)
  - [javascript-window-framework](https://www.npmjs.com/package/javascript-window-framework)
- バックエンドフレームワーク (オレオレフレームワーク)
  - [active-module-framework](https://www.npmjs.com/package/active-module-framework)
- パッケージ化
  - [electron](https://www.npmjs.com/package/electron)


## electronを利用する場合

- electron用sqlite3のインストール

```
npm run install-sqlite
```

- electronのWindows用パッケージの作成

```
npm run build-electron
```

- db (ローカルDB用ファイル置き場)
- local_modules (ローカルモジュール置き場)
  - active-module-framework (ActiveModuleFramework本体)
- dist
  - public (フロントエンド公開用ディレクトリ)
  - template (トップページHTML置き場)
  - sock (UNIXドメインソケット使用時のファイル置き場)
- src
  - app (バックエンド用プログラムroot)
    - modules (ActiveModuleFramework用拡張モジュール置き場)
  - public (フロントエンド用ソースコード)
  - main (フロントエンド用プログラム)
    - scss (フロントエンド用CSS)
