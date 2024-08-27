/** util.js ********************************************************************************************************* */
export default window.UTIL = {
  cookie: {
    get (key) {
      /**
       * get cookie
       * @param   {String}  key
       */
      let value = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
      return value ? decodeURIComponent(value[2]) : null
    },
    set (key, value, day) {
      /**
       * set cookie
       * @param   {String}  key
       * @param   {*}       value
       * @param   {Number}  expire     day = 1
       */
      const expired = new Date()
      expired.setTime(expired.getTime() + day * 24 * 60 * 60 * 1000)
      document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + expired.toUTCString() + ';path=/'
    },
    clear (key) {
      /**
       * delete cookie
       * @param   {String}  key
       */
      document.cookie = key + '=; expires=Thu, 01 Jan 1999 00:00:00 GMT;'
    }
  },
  storage: {
    get (storageType, key) {
      /**
       * get SessionStorage
       * @param   {String}  storage
       * @param   {String}  key
       */
      let value = (storageType === 'local') ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key)
      let now = new Date().getTime()

      if (value) {
        value = JSON.parse(value)

        if (value.expires === -1 || value.expires >= now) {
          value = value.json ? JSON.parse(value.origin) : value.origin

        } else {
          this.remove(storageType, key)
          value = undefined
        }
      } else {
        value = undefined
      }

      return value
    },
    set (storageType, key, value, expireMinutes) {
      /**
       * set storage
       * @param   {String}  storage
       * @param   {String}  key
       * @param   {*}       value
       * @param   {Number}  expireMinutes   30 sec = 0.5
       */
      let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
      let json = false

      if (expireMinutes) {
        let today = new Date()
        today.setSeconds(today.getSeconds() + expireMinutes * 60)
        expireMinutes = today.getTime()
      }

      if (typeof value === 'object') {
        value = JSON.stringify(value)
        json = true
      }

      storage['setItem'](
        key,
        JSON.stringify({
          expires: expireMinutes || -1,
          origin: value,
          json: json
        })
      )
    },
    remove (storageType, key) {
      /**
       * remove storage
       * @param   {String}  storage
       * @param   {String}  key
       */
      let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
      storage['removeItem'](key)
    },
    clear (storageType) {
      /**
       * clear storage
       * @param   {String}  storage
       * @param   {String}  key
       */
      let storage = storageType === 'local' ? window.localStorage : window.sessionStorage
      storage['clear']()
    }
  },
  validate: {
    email (email) {
      let exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
      if (!exptext.test(email)) {
        //이메일 형식이 알파벳+숫자@              알파벳+숫자.알파벳+숫자 형식이 아닐경우
        alert("이메일형식이 올바르지 않습니다.")
        return false
      }
      return true
    }
  },
  isMobile () {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile && navigator.userAgent.indexOf('Safari') > -1) {
      if (navigator.maxTouchPoints > 0) {
        isMobile = true
      }
    }
    return isMobile
  },
  isLandscape () {
    /**
     * 가로모드 인지 체크하여 반환
     * @return   {Boolean}
     */
    return window.innerWidth > window.innerHeight
  },
  urlParam (name) {
    /**
     * url parameter
     * @param   {String}  name
     *
     */
    let result = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href)
    return result === null ? null : result[1] || 0
  },
  numberFormat: {
    comma (number) {
      /**
       * 1,234,567
       * @param   {String}  number
       * @return  {String}
       */
      let regexp = /\B(?=(\d{3})+(?!\d))/g
      return number.toString().replace(regexp, ',')
    },
    tel (number) {
      /**
       * 00-000-0000, 000-0000-0000
       * @param   {String}  number
       * @return  {String}
       */
      return number.toString()
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
        .replace('--', '-')
    }
  },
  easing: {
    // transform
    Quad: {
      easeIn: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
      easeOut: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
      easeInOut: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)'
    },
    Cubic: {
      easeIn: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
      easeOut: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
    },
    Quart: {
      easeIn: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
      easeOut: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      easeInOut: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
    },
    Quint: {
      easeIn: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
      easeOut: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
      easeInOut: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
    },
    Sine: {
      easeIn: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
      easeOut: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
      easeInOut: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    },
    Expo: {
      easeIn: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
      easeOut: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
      easeInOut: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
    },
    Circ: {
      easeIn: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
      easeOut: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
      easeInOut: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
    },
    Back: {
      easeIn: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
      easeOut: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      easeInOut: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
    }
  }
}
/** ***************************************************************************************************************** */
