import './accordion.js'
import './blockScroll.js'
import './countdown.js'
import './datepicker.js'
import './dropdown.js'
import './input.js'
import './loading.js'
import './modal.js'
import './paging.js'
import './postcode.js'
import './swipe.js'
import './tab.js'
import './textarea.js'
import './transform.js'

/** pluginManager *************************************************************************************************** */
let pluginPool = {}
let pluginIndex = 0

export default window.PLUGIN = {
	add (element, plugin, pluginName) {
    let pluginId = pluginName + pluginIndex
		element.setAttribute('applied-plugin', pluginId)
    pluginPool[pluginId] = plugin
    pluginIndex++

		return plugin
	},
	call (element, method, value) {
		if (method === 'clear') return this.remove(element, method, value)

		let pluginId = element.getAttribute('applied-plugin')
		if (!pluginId) return element

		return pluginPool[pluginId][method](value) || element
	},
	remove (element, method, value) {
		let pluginId = element.getAttribute('applied-plugin')
		if (!pluginId) return element

		pluginPool[pluginId]['clear'](value)
		delete pluginPool[element.getAttribute('applied-plugin')]
		element.removeAttribute('applied-plugin')

		return element
	},
	init () {
		Array.from(document.getElementsByClassName('js-accordion')).forEach($Accordion => $Accordion.accordion())
		Array.from(document.getElementsByClassName('js-dropdown')).forEach($dropdown => $dropdown.dropdown())
		Array.from(document.getElementsByClassName('js-input')).forEach($input => $input.input())
		Array.from(document.getElementsByClassName('js-tab')).forEach($tab => $tab.tab())
		Array.from(document.getElementsByClassName('js-textarea')).forEach($textarea => $textarea.textarea())
	}
}
/** ***************************************************************************************************************** */
