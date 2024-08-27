/** tab.js ********************************************************************************************************** */
const PLUGIN_NAME = 'tab'

Object.assign(HTMLElement.prototype, {
  tab (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Tab(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Tab {
  constructor (el, options) {
    this.$tab = el
    this.$content = el.querySelectorAll('.content')
    this.$button = el.querySelectorAll('.tab-list > button')

    this.options = Object.assign({
      activeIndex: 0,
      disabledIndex: -1
    }, options)

    this.activeIndex = parseInt(this.options.activeIndex)
    this.disabledIndex = parseInt(this.options.disabledIndex)

    this.eventHandler = {
      clickTab: e => {
        let idx = [...e.target.parentElement.children].indexOf(e.target)
        if (idx === this.activeIndex) return

        this.active(idx)
      }
    }

    this.$button.forEach(($btn, index) => {
      if (this.disabledIndex == index) {
        $btn.disabled = true
        $btn.classList.add('disabled')
      } else {
        $btn.addEventListener('click', this.eventHandler.clickTab)
      }
    })

    this.active(this.activeIndex)
  }

  active (idx) {
    this.activeIndex = idx
    this.$content.forEach(($content, index) => {
      $content.classList[idx === index ? 'add' : 'remove']('active')
      $content.hidden = !(idx === index)
    })
    this.$button.forEach(($btn, index) => {
      $btn.classList[idx === index ? 'add' : 'remove']('active')
      $btn.setAttribute('aria-selected', idx === index)
    })
    this.$tab.dispatchEvent(new CustomEvent('change', {detail: {activeIndex: idx}}))
  }

  clear () {
    this.active(-1)
    this.$content.forEach($content => $content.removeAttribute('hidden'))
    this.$button.forEach($btn => {
      $btn.disabled = false
      $btn.classList.remove('disabled')
      $btn.removeEventListener('click', this.eventHandler.clickTab)
    })
  }
}
/** ***************************************************************************************************************** */
