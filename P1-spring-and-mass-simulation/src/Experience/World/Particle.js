import * as THREE from 'three'

import Experience from '../Experience'

export default class Particle {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(0.2, 32, 16)
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.y = 2

    this.scene.add(this.mesh)
  }

  update() {}
}
