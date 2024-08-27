/** datepicker.js ***************************************************************************************************** */
const PLUGIN_NAME = 'datepicker'
const DATE_FORMAT = 'YYYY-MM-DD'

Object.assign(HTMLElement.prototype, {
  datepicker (options = {}, value) {
    if (typeof options === 'string') {
      return PLUGIN.call(this, options, value)
    } else {
      let appliedPlugin = this.getAttribute('applied-plugin')
      if (!appliedPlugin || appliedPlugin.indexOf(PLUGIN_NAME) < 0) {
        PLUGIN.add(this, new Datepicker(this, options), PLUGIN_NAME)
      }
      return this
    }
  }
})

class Datepicker {
  constructor (el, options) {
    tui.DatePicker.localeTexts['custom'] = {
      titles: {
        MMMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        DD: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        D: ['일', '월', '화', '수', '목', '금', '토']
        // MMMM: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        // DD: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        // D: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat']
      },
      titleFormat: 'yyyy년 MMMM',
      todayFormat: 'yyyy년 MMMM d일 DD',
      date: 'Date',
      time: 'Time'
    }

    this.$datepicker = el
    this.$input = el.querySelector('input')

    this.options = Object.assign({
      language: 'custom',
      calendar: {
        showToday: false
      },
      input: {
        element: '.js-datepicker input',
        format: 'YYYY-MM-dd'
      },
      showAlways: false,
      autoClose: true,
      openers: []
    }, options)

    this.date = ''
    this.eventHandler = {
      open: e => {
        let $con = this.$container
        if ($con.offsetTop + $con.clientHeight > window.scrollY + window.innerHeight) {
          $con.style.top = ($con.offsetTop - $con.offsetHeight) + 'px'
        }
      },
      close: e => {
        this.$container.style = ''
      },
      change: e => {
        let date = this.datepicker.getDate()
        this.date = {
          formatDate: window.moment(date).format(DATE_FORMAT),
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getDate(),
          day: (function (day) {
            switch (day) {
              case 0: day = 'Sun'; break;
              case 1: day = 'Mon'; break;
              case 2: day = 'Tue'; break;
              case 3: day = 'Wed'; break;
              case 4: day = 'Thu'; break;
              case 5: day = 'Fir'; break;
              case 6: day = 'Sat'
            }
            return day
          })(date.getDay())}

        this.$datepicker.dispatchEvent(new CustomEvent('change', {detail: this.date}))
      }
    }

    this.datepicker = new tui.DatePicker('#tui-date-picker-wrapper', this.options)
    this.$container = el.querySelector('.tui-datepicker')

    this.datepicker.on('open', this.eventHandler.open)
    this.datepicker.on('close', this.eventHandler.close)
    this.datepicker.on('change', this.eventHandler.change)
    this.datepicker.setDate(new Date())
  }

  show () {
    this.datepicker.open()
  }

  hide () {
    this.datepicker.close()
  }

  enable () {
    this.datepicker.enable()
  }

  disable () {
    this.datepicker.disable()
  }

  get () {
    return this.date
  }

  set (date) {
    this.datepicker.setDate(new Date(window.moment(date).format(DATE_FORMAT)))
  }

  clear () {
    this.datepicker.off('open')
    this.datepicker.off('close')
    this.datepicker.off('change')
    this.datepicker.destroy()
    this.datepicker = null
    this.date = {
      formatDate: '',
      year: '',
      month: '',
      date: '',
      day: ''
    }
    this.$input.disabled = false
    this.$input.value = ''
  }
}
/** ***************************************************************************************************************** */
