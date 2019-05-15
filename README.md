# MyDNS Explorer

## 用途

- アカウントを登録することによって、MyDNSの登録情報を管理します  
親子のIDを登録すると、TreeViewで階層化して表示します  
どのアカウントに何を設定したのかを、すばやく確認可能です  

- 開発中のバックエンド用ActiveModuleFrameworkとフロントエンド用JavaScriptWindowフレームワークを検証するため、  
テスト的に作ってみました  
SPA(SinglePageApplication)を前提とするフレームワークです  

- サーバを用意してWEBサービスとして公開しようかとも思いましたが、  
 他人のIDとパスワードを預かることになり、負担が大きいので止めました  

## ライセンス
　MITライセンス  
　ソースコードは自由に使って構いませんが、無保証です  

## スクリーンショット
![スクリーンショット](https://raw.githubusercontent.com/activemoduleframework/MyDNS-Explorer/sc/ScreenShot01.png)

## 起動方法

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
  - pm2で起動(要pm2のグローバルモジュール)
  	```
	pm2 start
	```

- フロントエンド側
	```
	http://localhost:58621/
	```

## 動作ブラウザ
- 一般的なブラウザ(IE11でも動作可能)

## 使用技術

- バックエンド側
	- Node.js 10系統
	- TypeScript 3系統
	- ActiveModuleFramework

- フロントエンド側
	- TypeScript 3系統
	- [JSW](https://croud.jp/?p=484)
	- [promisejs](https://www.promisejs.org/)


## electronを利用する場合

- electron用sqlite3のインストール

```
npm install sqlite3 --build-from-source --save --runtime=electron --target=5.0.1 --dist-url=https://atom.io/download/electron
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
