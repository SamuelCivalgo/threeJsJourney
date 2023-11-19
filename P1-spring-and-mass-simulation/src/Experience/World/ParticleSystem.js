import Particle from './Particle' // Your Particle class
import Spring from './Spring' // Your Spring class
import Experience from '../Experience'

export default class ParticleSystem {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.particles = []
    this.springs = []

    this.createParticles(2)
    this.createSprings()
  }

  createParticles(number) {
    for (let i = 0; i < number; i++) {
      const particle = new Particle()

      particle.mesh.position.x = Math.random() * 10 - 5 // Random position between -5 and 5
      particle.mesh.position.y = 2
      particle.mesh.position.z = Math.random() * 10 - 5

      this.particles.push(particle)
    }
  }

  createSprings() {
    for (let i = 0; i < this.particles.length - 1; i++) {
      const spring = new Spring(this.particles[i], this.particles[i + 1])
      this.springs.push(spring)
      this.scene.add(spring.mesh) // Add spring mesh to the scene
    }
  }

  update() {
    this.particles.forEach((particle) => {
      particle.update()
    })

    this.springs.forEach((spring) => {
      spring.update()
    })
  }
}
