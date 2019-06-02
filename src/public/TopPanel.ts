import * as JWF from 'javascript-window-framework'

export interface TopButton extends HTMLDivElement {
	setText(text: string): void
}
/**
 *トップパネル表示用クラス
 *
 * @export
 * @class TopPanel
 * @extends {JWF.Window}
 */
export class TopPanel extends JWF.Window {
	constructor() {
		super()
		this.setHeight(80)
		const client = this.getClient()
		client.dataset.style = 'TOP'
	}
	createButton(imageURL: string, title: string, text?: string) {
		var buttonNode = document.createElement('div') as TopButton
		var imageNode = document.createElement('img')
		var textNode = document.createElement('div')
		buttonNode.appendChild(imageNode)
		buttonNode.appendChild(textNode)
		imageNode.src = imageURL
		imageNode.title = title
		if (text)
			textNode.innerText = text

		buttonNode.setText = (text: string) => {
			textNode.innerText = text
		}
		this.getClient().appendChild(buttonNode)

		return buttonNode
	}
}