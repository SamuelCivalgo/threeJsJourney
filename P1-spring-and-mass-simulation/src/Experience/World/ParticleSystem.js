import Particle from './Particle' // Your Particle class
import Spring from './Spring' // Your Spring class
import Experience from '../Experience'
import { Vector3 } from 'three'

const GRAVITY_ACCELERATION = -9.81

export default class ParticleSystem {
  constructor() {
    this.experience = new Experience()
    this.simulationStarted = false
    this.time = this.experience.time
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.particles = []
    this.springs = []

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Particle System')
      this.debugFolder.open()

      const debugObject = {
        toggleSimulation: () =>
          (this.simulationStarted = !this.simulationStarted),
      }

      this.debugFolder.add(debugObject, 'toggleSimulation')
    }

    this.createParticles(10)
    this.createSprings()
  }

  createParticles(number) {
    const radiusIncrease = 0.5

    for (let i = 0; i < number; i++) {
      const x = Math.cos(i) * i * radiusIncrease
      const y = 2
      const z = Math.sin(i) * i * radiusIncrease

      const particle = new Particle(new Vector3(x, y, z))

      this.particles.push(particle)
    }

    this.particles[0].isFixed = true
  }

  createSprings() {
    for (let i = 0; i < this.particles.length - 1; i++) {
      const spring = new Spring(this.particles[i], this.particles[i + 1])
      this.springs.push(spring)
      this.scene.add(spring.mesh)
    }
  }

  computeForces() {
    this.particles.forEach((particle) => {
      particle.force.set(0, particle.mass * GRAVITY_ACCELERATION, 0)
    })
  }

  // Gauss-Seidel
  simulationStep() {
    this.computeForces()
    // const vPlusArray = []

    const deltaSeconds = this.time.delta * 0.001

    // for (let i = 0; i < this.particles.length; i++) {
    //   const vPlus = new Vector3(0, 0, 0)
    //   vPlusArray.push(vPlus)
    // }

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      const acceleration = particle.force
        .clone()
        .multiplyScalar(1 / particle.mass)

      particle.velocity.add(acceleration.clone().multiplyScalar(deltaSeconds))
      if (particle.isFixed) {
        particle.velocity.set(0, 0, 0)
      }

      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaSeconds)
      )
    }

    // for (let i = 0; i < this.particles.length; i++) {
    //   const particle = this.particles[i]

    //   particle.position.add(particle.velocity.multiplyScalar(deltaSeconds))
    // }
  }

  update() {
    if (this.simulationStarted) {
      this.simulationStep()
    }
    this.particles.forEach((particle) => {
      particle.update()
    })

    this.springs.forEach((spring) => {
      spring.update()
    })
  }
}
