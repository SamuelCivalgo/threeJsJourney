import * as THREE from 'three'

export default class Spring {
  constructor(particleA, particleB) {
    this.particleA = particleA
    this.particleB = particleB

    this.particleA.connectedSprings.push(this)
    this.particleB.connectedSprings.push(this)

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    const distance = this.particleA.position.distanceTo(this.particleB.position)
    this.restLength = distance
    this.geometry = new THREE.CylinderGeometry(0.05, 0.05, distance, 8)
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.update()
  }

  update() {
    const midpoint = new THREE.Vector3()
      .addVectors(this.particleA.position, this.particleB.position)
      .multiplyScalar(0.5)
    this.mesh.position.copy(midpoint)

    const axis = new THREE.Vector3().subVectors(
      this.particleB.mesh.position,
      this.particleA.mesh.position
    )

    const up = new THREE.Vector3(0, 1, 0)
    this.mesh.quaternion.setFromUnitVectors(up, axis.normalize())

    const distance = this.particleA.position.distanceTo(this.particleB.position)

    const newYRatio = distance / this.restLength

    this.mesh.scale.set(1, newYRatio, 1)
  }
}
