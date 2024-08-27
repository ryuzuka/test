import UTIL from '../util.js'

/** textarea.js ***************************************************************************************************** */
const PLUGIN_NAME = 'textarea'

Object.assign(HTMLElement.prototype, {
  textarea (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Textarea(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Textarea {
  constructor (el, options) {
    this.$textarea = el.querySelector('textarea')
    this.$current = el.querySelector('.current-length')
    this.$total = el.querySelector('.total-length')

    this.options = Object.assign({}, options)

    this.maxlength = parseInt(this.$textarea.getAttribute('maxlength'))
    this.value = this.$textarea.value

    this.eventHandler = {
      typingTextarea: e => {
        let value = e.target.value
        this.value = value
        this.$current.innerText = UTIL.numberFormat.comma(value.length)
      }
    }

    this.$textarea.addEventListener('keydown', this.eventHandler.typingTextarea)
    this.$textarea.addEventListener('keyup', this.eventHandler.typingTextarea)

    this.$total.innerText = UTIL.numberFormat.comma(this.maxlength)
    this.$current.innerText = this.value.length
  }

  get () {
    return {length: parseInt(this.$current.innerText)}
  }

  clear () {
    this.maxlength = 0
    this.$current.innerText = 0
    this.$total.innerText = 0
    this.$textarea.removeEventListener('keydown', this.eventHandler.typingTextarea)
    this.$textarea.removeEventListener('keyup', this.eventHandler.typingTextarea)
  }
}
/** ***************************************************************************************************************** */
