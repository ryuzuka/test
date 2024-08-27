/** swipe.js ********************************************************************************************************* */
let PLUGIN_NAME = 'swipe'

Object.assign(HTMLElement.prototype, {
  swipe (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Swipe(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Swipe {
  constructor (el, options) {
    this.$body = el
    this.direction = options.direction || 'vertical' // horizontal, vertical
    this.callback = {
      down: options.down,
      move: options.move,
      up: options.up
    }

    this.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion)
    this.hasTouch = 'ontouchstart' in window && !this.isTouchPad

    this.DOWN_EV = this.hasTouch ? 'touchstart' : 'mousedown'
    this.MOVE_EV = this.hasTouch ? 'touchmove' : 'mousemove'
    this.UP_EV = this.hasTouch ? 'touchend' : 'mouseup'

    this.init()
  }

  init () {
    this.DOWNX = 0
    this.DOWNY = 0
    this.dragDist = 0
    this.dragDir = 0

    this.eventHandler = {
      down: this.eventHandlers().down,
      move: this.eventHandlers().move,
      up: this.eventHandlers().up
    }

    this.on()
  }

  eventHandlers () {
    return {
      down: e => {
        this.$body.addEventListener(this.MOVE_EV, this.eventHandler.move)
        this.$body.addEventListener(this.UP_EV, this.eventHandler.up)

        this.dragDist = 0
        let point = this.hasTouch ? e.touches[0] : e

        if (this.direction === 'horizontal') {
          this.DOWNX = point.clientX
          this.DOWNY = point.clientY
        } else if (this.direction === 'vertical') {
          this.DOWNX = point.clientY
          this.DOWNY = point.clientX
        }

        if (this.callback.down) {
          this.callback.down()
        }
      },
      move: e => {
        let point = this.hasTouch ? e.touches[0] : e

        if (this.direction === 'horizontal') {
          if (Math.abs(point.clientY - this.DOWNY) < Math.abs(point.clientX - this.DOWNX)) {
            this.dragDist = point.clientX - this.DOWNX
          }
        } else if (this.direction === 'vertical') {
          if (Math.abs(point.clientX - this.DOWNY) < Math.abs(point.clientY - this.DOWNX)) {
            this.dragDist = point.clientY - this.DOWNX
          }
        }

        if (this.callback.move) {
          this.callback.move()
        }
      },
      up: e => {
        this.$body.removeEventListener(this.MOVE_EV, this.eventHandler.move)
        this.$body.removeEventListener(this.UP_EV, this.eventHandler.up)

        if (Math.abs(this.dragDist) < 80) return false

        if (this.dragDist < 0) {
          this.dragDir = 1
        } else {
          this.dragDir = -1
        }

        if (this.callback.up) {
          this.callback.up(this.dragDir, this.dragDist)
        }
      }
    }
  }

  on () {
    this.$body.addEventListener(this.DOWN_EV, this.eventHandler.down)
  }

  off () {
    this.$body.removeEventListener(this.DOWN_EV, this.eventHandler.down)
    this.$body.removeEventListener(this.MOVE_EV, this.eventHandler.move)
    this.$body.removeEventListener(this.UP_EV, this.eventHandler.up)
  }

  clear () {
    this.off()

    this.DOWNX = 0
    this.DOWNY = 0
    this.dragDist = 0
    this.dragDir = 0
    this.eventHandler = {}
  }
}
/** ***************************************************************************************************************** */
