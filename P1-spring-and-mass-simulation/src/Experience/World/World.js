import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Mass from './Mass.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on('ready', () => {
      this.setEnvironment()
    })
  }

  setEnvironment() {
    this.floor = new Floor()
    this.fox = new Fox()
    this.mass = new Mass()

    this.environment = new Environment()
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
