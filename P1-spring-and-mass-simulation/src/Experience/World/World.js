import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import ParticleSystem from './ParticleSystem.js'

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
    // this.floor = new Floor()
    // this.fox = new Fox()
    this.particleSystem = new ParticleSystem()

    this.environment = new Environment()
  }

  update() {
    if (this.particleSystem) {
      this.particleSystem.update()
    }

    if (this.fox) {
      this.fox.update()
    }
  }
}
