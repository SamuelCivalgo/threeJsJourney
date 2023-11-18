import * as dat from 'lil-gui'

export default class Debug {
  constructor() {
    this.active = true // window.location.hash === '#debug'

    if (this.active) {
      this.ui = new dat.GUI()
    }
  }
}
