/** component.js *************************************************************************************************** */
window.addEventListener('DOMContentLoaded', e => {
  // document ready

  Object.assign(Component, {Header, Footer})
  for (let comp in Component) {
    let component = Component[comp]
    App[comp] = (comp === 'Header' || comp === 'Footer') ? new component() : component()
  }
})

const Header = function () {
  let _this = {}
  return _this
}

const Footer = function () {
  let _this = {}
  return _this
}

const Component = {}
/** ***************************************************************************************************************** */
