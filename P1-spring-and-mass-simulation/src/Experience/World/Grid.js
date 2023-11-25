import * as THREE from 'three'

import Experience from '../Experience'

export default class Grid {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    const grid = new THREE.GridHelper(750, 75)
    grid.position.y = -50

    this.scene.add(grid)
  }
}
