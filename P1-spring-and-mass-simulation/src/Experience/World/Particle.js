import * as THREE from 'three'

import Experience from '../Experience'

export default class Particle {
  constructor(isFixed = false) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.isFixed = false

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
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
    this.mesh.position.y = 2

    this.scene.add(this.mesh)
  }

  update() {
    const newColor = this.isFixed ? 0x00ff00 : 0xff0000
    this.material.color.set(newColor)
  }
}
