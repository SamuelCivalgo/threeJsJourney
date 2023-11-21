import Particle from './Particle' // Your Particle class
import Spring from './Spring' // Your Spring class
import Experience from '../Experience'
import { Vector3 } from 'three'

const GRAVITY_ACCELERATION = -9.81

const EXAMPLES = ['Spiral', 'Rope', 'Cloth', 'Large Cloth', 'Beam']
const ALGORITHMS = ['Explicit Euler', 'Gauss-Seidel']

export default class ParticleSystem {
  constructor() {
    this.experience = new Experience()
    this.simulationStarted = false
    this.time = this.experience.time
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.stiffness = 1000
    this.frictionCoefficient = 0.005
    this.currentExample = 'Rope'
    this.currentAlgorithm = 'Explicit Euler'

    this.particles = []
    this.springs = []

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Particle System')
      this.debugFolder.open()

      const debugObject = {
        ['Start Simulation']: () =>
          (this.simulationStarted = !this.simulationStarted),
        ['Step']: () => this.simulationStep(),
        ['Reset']: () => this.loadExample(),
      }

      this.debugFolder.add(debugObject, 'Start Simulation')
      this.debugFolder.add(debugObject, 'Step')
      this.debugFolder.add(debugObject, 'Reset')
      this.debugFolder.add(this, 'stiffness').min(0).max(5000).step(1)
      this.debugFolder
        .add(this, 'frictionCoefficient')
        .min(0)
        .max(0.01)
        .step(0.001)
      this.debugFolder.add(this, 'currentExample', EXAMPLES).onChange(() => {
        this.loadExample()
      })
      this.debugFolder
        .add(this, 'currentAlgorithm', ALGORITHMS)
        .onChange(() => {})
    }

    this.loadExample()
  }

  reset() {
    this.particles.forEach((particle) => {
      this.scene.remove(particle.mesh)
    })
    this.springs.forEach((spring) => {
      this.scene.remove(spring.mesh)
    })

    this.particles = []
    this.springs = []
  }

  loadExample() {
    this.reset()

    switch (this.currentExample) {
      case 'Spiral':
        this.createSpiral()
        break
      case 'Rope':
        this.createRope()
        break
      case 'Cloth':
        this.createCloth()
        break
      case 'Large Cloth':
        this.createCloth(32)
        break
      case 'Beam':
        this.createBeam()
        break
      default:
        console.log('Unknown example:', this.currentExample)
    }
  }

  createSpiral() {
    const number = 50

    const radiusIncrease = 0.1

    for (let i = 0; i < number; i++) {
      const x = Math.cos(i) * i * radiusIncrease
      const y = 0
      const z = Math.sin(i) * i * radiusIncrease

      const particle = new Particle(new Vector3(x, y, z))

      this.particles.push(particle)

      if (i % 5 === 0) {
        this.particles[i].isFixed = true
      }
    }

    this.particles[0].isFixed = true
    this.particles[number - 1].isFixed = true

    for (let i = 0; i < this.particles.length - 1; i++) {
      const spring = new Spring(this.particles[i], this.particles[i + 1])
      this.springs.push(spring)
      this.scene.add(spring.mesh)
    }
  }

  createRope() {
    const number = 10
    const deltaIncrease = 1

    for (let i = 0; i < number; i++) {
      const x = i * deltaIncrease - (number * deltaIncrease) / 2
      const y = 0
      const z = 0

      const particle = new Particle(new Vector3(x, y, z))

      this.particles.push(particle)
    }
    this.particles[0].isFixed = true
    this.particles[number - 1].isFixed = true

    for (let i = 0; i < this.particles.length - 1; i++) {
      const spring = new Spring(this.particles[i], this.particles[i + 1])
      this.springs.push(spring)
      this.scene.add(spring.mesh)
    }
  }

  createCloth(N = 16) {
    const x_start = -N / 2
    const y_start = -N / 2
    const dx = 1
    const dy = 1

    this.particles = []
    this.springs = []

    let index = 0

    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < N; ++j) {
        const x = x_start + j * dx
        const y = 0
        const z = y_start + i * dy

        // Create and add particle
        const particle = new Particle(new Vector3(x, y, z))
        if ((j === 0 && i === N - 1) || (j === N - 1 && i === N - 1)) {
          particle.isFixed = true // Fixing corner particles
        }
        this.particles.push(particle)

        // Create and add springs
        if (i > 0) {
          this.springs.push(new Spring(this.particles[index - N], particle))
        }
        if (j > 0) {
          this.springs.push(new Spring(this.particles[index - 1], particle))
        }
        if (i > 0 && j > 0) {
          const diagonalDistance = Math.sqrt(dx * dx + dy * dy)
          this.springs.push(
            new Spring(
              this.particles[index - N - 1],
              particle,
              undefined,
              diagonalDistance
            )
          )
        }
        ++index
      }
    }

    // Add particles and springs to the scene
    this.particles.forEach((particle) => this.scene.add(particle.mesh))
    this.springs.forEach((spring) => this.scene.add(spring.mesh))
  }

  createBeam(N = 8) {
    const x_start = -N / 2
    const y_start = -N / 2
    const dx = 1
    const dy = 1
    const dz = 1

    this.particles = []

    this.springs = []

    let index = 0

    const particles2 = []

    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < N; ++j) {
        const x = x_start + j * dx
        const y = 0
        const z = y_start + i * dz

        // Create and add particle
        const particle = new Particle(new Vector3(x, y, z))
        const particle2 = new Particle(new Vector3(x, y + dy, z))
        if (j === 0) {
          particle.isFixed = true
          particle2.isFixed = true
        }
        this.particles.push(particle)
        particles2.push(particle2)

        // Create and add springs
        if (i > 0) {
          this.springs.push(new Spring(this.particles[index - N], particle))
          this.springs.push(new Spring(particles2[index - N], particle2))
        }
        if (j > 0) {
          this.springs.push(new Spring(this.particles[index - 1], particle))
          this.springs.push(new Spring(particles2[index - 1], particle2))

          this.springs.push(
            new Spring(particles2[index], this.particles[index])
          )
          this.springs.push(
            new Spring(particles2[index], this.particles[index - 1])
          )
        }
        this.springs.push(new Spring(particles2[index], this.particles[index]))

        if (i > 0 && j > 0) {
          const diagonalDistance = Math.sqrt(dx * dx + dy * dy)
          this.springs.push(
            new Spring(
              this.particles[index - N - 1],
              particle,
              undefined,
              diagonalDistance
            )
          )
          this.springs.push(
            new Spring(
              particles2[index - N - 1],
              particle2,
              undefined,
              diagonalDistance
            )
          )
          this.springs.push(
            new Spring(
              particles2[index - N],
              particle,
              undefined,
              diagonalDistance
            )
          )
        }
        ++index
      }
    }

    this.particles = this.particles.concat(particles2)

    // Add particles and springs to the scene
    this.particles.forEach((particle) => this.scene.add(particle.mesh))
    this.springs.forEach((spring) => this.scene.add(spring.mesh))
  }

  computeForces() {
    this.particles.forEach((particle) => {
      particle.force.set(0, particle.mass * GRAVITY_ACCELERATION, 0)
    })

    this.springs.forEach((spring) => {
      const particleA = spring.particleA
      const particleB = spring.particleB

      // Calculate displacement from rest length
      const displacement =
        particleA.position.distanceTo(particleB.position) - spring.restLength

      // Calculate force magnitude (Hooke's Law)
      const forceMagnitude = -this.stiffness * displacement

      // Calculate force direction
      const forceDirection = new Vector3()
        .subVectors(particleB.mesh.position, particleA.mesh.position)
        .normalize()

      // Calculate final force vector
      const force = forceDirection.multiplyScalar(forceMagnitude)

      // Apply to particleA and particleB (equal and opposite)
      particleA.force.sub(force)
      particleB.force.add(force)
    })
  }

  simulationStepExplicitEuler() {
    this.computeForces()

    const deltaSeconds = this.time.delta * 0.001

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      // Calculate acceleration
      const acceleration = particle.force
        .clone()
        .multiplyScalar(1 / particle.mass)

      // Apply acceleration
      particle.velocity.add(acceleration.clone().multiplyScalar(deltaSeconds))

      // Apply friction
      const frictionForce = particle.velocity
        .clone()
        .multiplyScalar(-this.frictionCoefficient)
      particle.velocity.add(frictionForce)

      if (particle.isFixed) {
        particle.velocity.set(0, 0, 0)
      }

      // Apply velocity
      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaSeconds)
      )
    }
  }

  simulationStepGaussSeidel() {}

  simulationStep() {
    switch (this.currentAlgorithm) {
      case 'Explicit Euler':
        this.simulationStepExplicitEuler()
        break
      case 'Gauss-Seidel':
        this.simulationStepGaussSeidel()
        break
      default:
        console.log('Unknown algorithm:', this.currentAlgorithm)
    }
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
