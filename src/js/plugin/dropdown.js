/** dropdown.js ***************************************************************************************************** */
const PLUGIN_NAME = 'dropdown'

Object.assign(HTMLElement.prototype, {
  dropdown (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Dropdown(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Dropdown {
  constructor (el, options) {
    this.$dropdown = el
    this.$button = el.querySelector('.dropdown-btn')
    this.$list = el.querySelector('.dropdown-list')
    this.$option = el.querySelectorAll('.dropdown-list > li')

    this.options = Object.assign({
      activeIndex: -1,
      disabledIndex: -1
    }, options)

    this.activeIndex = parseInt(this.options.activeIndex)
    this.disabledIndex = parseInt(this.options.disabledIndex)
    this.placeholder = el.dataset.placeholder
    this.value = ''

    this.eventHandler = {
      clickDropdown: e => this.toggle(true),
      focusOutDropdown: e => {
        if (e.relatedTarget === null || e.relatedTarget.closest('.js-dropdown') === null) {
          this.toggle(false)
        }
      },
      clickOption: e => {
        let idx = [...this.$list.children].indexOf(e.target.parentElement)

        this.active(idx)
        this.toggle(false)
      }
    }

    this.$dropdown.addEventListener('focusout', this.eventHandler.focusOutDropdown)
    this.$button.addEventListener('click', this.eventHandler.clickDropdown)
    this.$option.forEach(($option, index) => {
      let $btn = $option.firstElementChild
      if (this.disabledIndex == index) {
        $btn.disabled = true
        $btn.classList.add('disabled')
      }
      $btn.addEventListener('click', this.eventHandler.clickOption)
    })

    if (this.placeholder) {
      this.$button.innerText = this.placeholder
    }
    this.active(this.activeIndex)
  }

  toggle (isOpen) {
    this.$button.setAttribute('aria-expanded', isOpen)
    this.$list.style.display = isOpen ? 'block' : 'none'

    return this.$dropdown
  }

  active (idx) {
    this.activeIndex = idx
    this.$option.forEach(($option, index) => {
      let $btn = $option.firstElementChild
      $option.setAttribute('aria-selected', index === idx)
      $option.classList[index === idx ? 'add' : 'remove']('active')
      $btn.classList[index === idx ? 'add' : 'remove']('active')
      if (index === idx) {
        this.value = $btn.dataset.value
        this.$button.innerText = $btn.innerText
        this.toggle(true)
        this.$list.scrollTop = $btn.offsetTop
        this.toggle(false)
      }
    })

    this.$dropdown.dispatchEvent(new CustomEvent('change', {detail: {activeIndex: idx, value: this.value}}))
  }

  get () {
    return {value: this.value, index: this.activeIndex}
  }

  clear () {
    this.active(-1)
    this.$button.innerText = this.placeholder
    this.$option.forEach($option => {
      let $btn = $option.firstElementChild
      $btn.disabled = false
      $btn.classList.remove('disabled')
      $btn.removeEventListener('click', this.eventHandler.clickOption)
      $option.setAttribute('aria-selected', false)
    })
    this.$dropdown.removeEventListener('focusout', this.eventHandler.focusOutDropdown)
    this.$button.removeEventListener('click', this.eventHandler.clickDropdown)
  }
}
/** ***************************************************************************************************************** */
