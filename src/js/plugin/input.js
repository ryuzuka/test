import UTIL from '../util.js'

/** input.js ******************************************************************************************************** */
const PLUGIN_NAME = 'input'

Object.assign(HTMLElement.prototype, {
  input (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        let type = this.querySelector('input').type || 'text'
        if (type === 'text')            PLUGIN.add(this, new Text(this, options), PLUGIN_NAME)
        else if (type === 'checkbox')   PLUGIN.add(this, new Checkbox(this, options), PLUGIN_NAME)
        else if (type === 'radio')      PLUGIN.add(this, new Radio(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Input {
  constructor (el, options) {
    this.$input = el.querySelector('input')
    this.options = Object.assign({}, options)
  }

  clear () {}
}

class Text extends Input {
  constructor (el, options) {
    super(el, options)

    this.eventHandler = {
      focus: e => {
        e.target.classList[e.type === 'focus' ? 'add' : 'remove']('focus')
      },
      number: e => {
        let value = e.target.value.replace(/\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1')
        e.target.value = this.isComma ? UTIL.numberFormat.comma(value) : value
      },
      tel: e => {
        e.target.value = UTIL.numberFormat.tel(e.target.value)
      }
    }

    this.$input.addEventListener('focus', this.eventHandler.focus)
    this.$input.addEventListener('blur', this.eventHandler.focus)

    let {classList} = this.$input
    this.isComma = [...classList].indexOf('comma') > -1

    if ([...classList].indexOf('number') > -1) {
      this.$input.addEventListener('keydown', this.eventHandler.number)
      this.$input.addEventListener('keyup', this.eventHandler.number)

    } else if ([...classList].indexOf('tel') > -1) {
      this.$input.addEventListener('keydown', this.eventHandler.tel)
      this.$input.addEventListener('keyup', this.eventHandler.tel)
    }
  }

  clear () {
    this.$input.classList.remove('focus')
    this.$input.removeEventListener('focus', this.eventHandler.focus)
    this.$input.removeEventListener('blur', this.eventHandler.focus)
    this.$input.removeEventListener('keydown', this.eventHandler.number)
    this.$input.removeEventListener('keyup', this.eventHandler.number)
    this.$input.removeEventListener('keydown', this.eventHandler.tel)
    this.$input.removeEventListener('keyup', this.eventHandler.tel)
  }
}

class Checkbox extends Input {
  constructor (el, options) {
    super(el, options)

    this.eventHandler = {
      checkbox: e => e.target.setAttribute('checked', e.target.checked)
    }

    this.$input.addEventListener('change', this.eventHandler.checkbox)

    let checked = this.$input.getAttribute('checked')
    let isCheckedFalse =  checked === 'false' || checked === null || checked === undefined

    this.$input.setAttribute('checked', isCheckedFalse ? 'false' : 'true')
    this.$input.checked = isCheckedFalse ? false : true
  }

  clear () {
    this.$input.removeAttribute('checked')
    this.$input.removeEventListener('change', this.eventHandler.checkbox)
  }
}

class Radio extends Input {
  constructor (el, options) {
    super(el, options)
  }
}
/** ***************************************************************************************************************** */
