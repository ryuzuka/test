/** accordion.js **************************************************************************************************** */
const PLUGIN_NAME = 'accordion'

Object.assign(HTMLElement.prototype, {
  accordion (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Accordion(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Accordion {
  constructor (el, options) {
    this.$accordion = el
    this.$content = el.querySelectorAll('.accordion-content')
    this.$button = el.querySelectorAll('.accordion-section > button')

    this.options = Object.assign({
      activeIndex: -1,
      disabledIndex: -1
    }, options)

    this.activeIndex = parseInt(this.options.activeIndex)
    this.disabledIndex = parseInt(this.options.disabledIndex)

    this.eventHandler = {
      clickAccordion: e => {
        let idx = [...this.$accordion.children].indexOf(e.target.parentElement)
        this.active(idx === this.activeIndex ? -1 : idx)
      }
    }

    this.$button.forEach(($btn, index) => {
      if (this.disabledIndex == index) {
        $btn.disabled = true
        $btn.classList.add('disabled')
      } else {
        $btn.addEventListener('click', this.eventHandler.clickAccordion)
      }
    })

    this.active(this.activeIndex)
  }

  active (idx) {
    this.activeIndex = idx
    this.$content.forEach(($content, index) => {
      $content.parentElement.classList[idx === index ? 'add' : 'remove']('active')
      $content.hidden = !(idx === index)
    })
    this.$button.forEach(($btn, index) => {
      $btn.setAttribute('aria-expanded', idx === index)
    })
    this.$accordion.dispatchEvent(new CustomEvent('change', {detail: {activeIndex: idx}}))
  }

  get () {
    return {index: this.activeIndex}
  }

  clear () {
    this.active(-1)
    this.$content.forEach($content => $content.removeAttribute('hidden'))
    this.$button.forEach($btn => {
      $btn.disabled = false
      $btn.classList.remove('disabled')
      $btn.removeEventListener('click', this.eventHandler.clickAccordion)
    })
  }
}
/** ***************************************************************************************************************** */
