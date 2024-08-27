/** transform.js **************************************************************************************************** */
let transform = null

Object.assign(HTMLElement.prototype, {
  transform (options = {}, callback) {
    /**
     * transform
     * @params	{Object}
     * 				  ex) {transform: 'translate(0px, 0px) scaleX(1) scaleY(1)', transition: '0s ease 0s'}
     *          ex) callback: transition-end
     */

    transform = transform || new Transform(this)
    transform.start(options, callback)

    return this
  }
})

class Transform {
  constructor (el) {
    this.$el = el
    this.isTransform = false
  }
  start (options = {}, callback) {
    if (this.isTransform) return

    this.isTransform = true
    Object.assign(this.$el.style, options)
    this.$el.addEventListener('transitionend', e => {
      this.isTransform = false
      if (callback) {
        callback(e)
      }
    })
  }
}
/** ***************************************************************************************************************** */
