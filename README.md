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
  - Windows用batで起動
	```
	start.bat
	```
  - pm2で起動(要pm2のグローバルモジュール)
  	```
	npm install
	pm2 start
	```

- フロントエンド側
	```
	http://localhost:8000/
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


## ディレクトリ構成

- app (バックエンド用プログラムroot)
  - modules (ActiveModuleFramework用拡張モジュール置き場)
- db (ローカルDB用ファイル置き場)
- local_modules (ローカルモジュール置き場)
  - active-module-framework (ActiveModuleFramework本体)
- public (フロントエンド公開用ディレクトリ)
  - css (スタイルシート置き場)
  - js (TypeScript出力結果)
- public_src (フロントエンド用ソースコード)
  - jsw (JSWライブラリ本体)
  - main (フロントエンド用プログラム)
  - scss (フロントエンド用CSS)
- sock (UNIXドメインソケット使用時のファイル置き場)
- template (トップページHTML置き場)
