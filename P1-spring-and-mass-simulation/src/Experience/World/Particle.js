import * as THREE from 'three'

import Experience from '../Experience'

const FIXED_MASS = 10000000

export default class Particle {
  constructor(position = new THREE.Vector3(0, 0, 0)) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.isFixed = false
    this.mass = 1
    this.position = position
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.force = new THREE.Vector3(0, 0, 0)
    this.connectedSprings = []

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    this.id = Math.floor(Math.random() * 10000)
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(0.2, 32, 16)
  }

  setMaterial() {
    const color = this.isFixed ? 0x00ff00 : 0xff0000

    this.material = new THREE.MeshStandardMaterial({ color: color })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  update() {
    const newColor = this.isFixed ? 0x00ff00 : 0xff0000
    this.mass = this.isFixed ? FIXED_MASS : 1
    this.material.color.set(newColor)
    this.mesh.position.copy(this.position)
  }
}
