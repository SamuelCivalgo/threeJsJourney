import * as THREE from 'three'

import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import Debug from './Utils/Debug'

import sources from './sources'

let instance = null

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this

    // Global access
    window.experience = this

    // Options
    this.canvas = canvas

    // Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // Sizes resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    // Time tick event
    this.time.on('tick', () => {
      this.update()
    })

    this.pointer = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    this.addPointerDownEventListener()
    this.pushForce = 10
  }

  addPointerDownEventListener() {
    window.addEventListener('pointerdown', (event) => {
      this.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      )

      this.raycaster.setFromCamera(this.pointer, this.camera.instance)

      const particlesMesh = this.world.particleSystem.particles.map(
        (particle) => {
          const mesh = particle.mesh
          mesh.particleId = particle.id

          return mesh
        }
      )

      const intersects = this.raycaster.intersectObjects(particlesMesh, false)

      if (intersects.length > 0) {
        const particleId = intersects[0].object.particleId

        const particle = this.world.particleSystem.particles.find(
          (particle) => particle.id === particleId
        )

        if (event.button === 0) {
          // Left click logic
          const rayDirection = this.raycaster.ray.direction
          const velocityChange = rayDirection
            .clone()
            .multiplyScalar(this.pushForce)
          particle.velocity.add(velocityChange)
        } else if (event.button === 2) {
          // Right click logic
          particle.isFixed = !particle.isFixed
        }
      }
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    if (this.debug.active) {
      this.debug.stats.begin()
    }

    this.camera.update()
    this.world.update()
    this.renderer.update()

    if (this.debug.active) {
      this.debug.stats.end()
    }
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) {
      this.debug.ui.destroy()

      this.debug.stats.destroy()
    }
  }
}
