/** countdown.js **************************************************************************************************** */
const PLUGIN_NAME = 'countdown'
const TIME_FORMAT = 'mm:ss'

Object.assign(HTMLElement.prototype, {
  countdown (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Countdown(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Countdown {
  constructor (el, options) {
    this.$countdown = el
    this.$count = el.querySelector('.time')

    this.options = Object.assign({
      format: TIME_FORMAT,    //  mm:ss
      count: 60
    }, options)

    this.format = this.options.format
    this.count = this.options.count
    this.interval = null
    this.time = null

    this.eventHandler = {}

    let hour = Math.floor(this.options.count / 3600).toString().padStart(2, '0')
    let minute = Math.floor(this.options.count / 60 >= 60 ? this.options.count % 60 : this.options.count / 60).toString().padStart(2, '0')
    let seconds = Math.floor(this.options.count % 60).toString().padStart(2, '0')
    let time = (this.format === 'HH:mm:ss' ? hour + ':' : '') + minute + ':' + seconds

    this.write(window.moment(time,  this.format))
  }

  write (time) {
    this.time = time
    this.$count.innerText = time.format(this.format)
  }

  start () {
    if (this.interval) return

    this.interval = setInterval(() => {
      this.count--
      if (this.count === 0) {
        this.$countdown.dispatchEvent(new Event('complete'))
        this.stop()
      }
      this.write(this.time.subtract(1, 'seconds'))
    }, 1000)
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      this.count = this.options.count
    }
  }

  clear () {
    this.stop()
    this.time = window.moment(0, this.format)
    this.write(this.time)
  }
}
/** ***************************************************************************************************************** */
