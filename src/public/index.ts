import "./scss/main.scss"
import { AppManager } from "./AppManager";

async function Main(){
	new AppManager()
}

//ページ読み込み時に実行する処理を設定
addEventListener("DOMContentLoaded", Main)
