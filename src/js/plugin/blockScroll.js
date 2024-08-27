/** blockScroll.js ************************************************************************************************** */
let blockScroll = null
let blockScrollEvent = null

Object.assign(HTMLBodyElement.prototype, {
  blockScroll(isScroll = true) {
    blockScroll = blockScroll || new BlockScroll('block-scroll')
    return blockScroll[isScroll ? 'block' : 'scroll'](this)
  },
  blockScrollEvent (isScroll = true) {
    blockScrollEvent = blockScrollEvent || new BlockScroll('block-scroll-event')
    return blockScrollEvent[isScroll ? 'block' : 'scroll'](this)
  }
})

class BlockScroll {
  constructor (event) {
    this.eventType = event
    this.isBlock = false
  }

  block ($documentBody) {
    if (this.isBlock) return this.isBlock
    this.isBlock = true

    $documentBody.classList.add(this.eventType)
    if (this.eventType === 'block-scroll-event') {
      $documentBody.addEventListener('wheel', this.blockScrollEventHandler, {passive: false})
      $documentBody.addEventListener('touchmove', this.blockScrollEventHandler, {passive: false})
    }

    return $documentBody
  }

  scroll ($documentBody) {
    if (!this.isBlock) return this.isBlock
    this.isBlock = false

    $documentBody.classList.remove(this.eventType)
    if (this.eventType === 'block-scroll-event') {
      $documentBody.removeEventListener('wheel', this.blockScrollEventHandler)
      $documentBody.removeEventListener('touchmove', this.blockScrollEventHandler)
    }

    return $documentBody
  }

  blockScrollEventHandler (e) {
    e.preventDefault()
  }
}
/** ***************************************************************************************************************** */
