import * as THREE from 'three'

import Experience from '../Experience'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.showDebug = false

    if (this.debug.active && this.showDebug) {
      this.debugFolder = this.debug.ui.addFolder('Environment')
      this.debugFolder.close()
    }

    this.setAmbientLight()
    this.setSunlight()
    this.setEnvironmentMap()
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight('#ffffff', 0.1)

    this.scene.add(this.ambientLight)

    if (this.debug.active && this.showDebug) {
      this.debugFolder
        .add(this.ambientLight, 'intensity')
        .min(0)
        .max(10)
        .step(0.001)
        .name('ambientLightIntensity')
    }
  }

  setSunlight() {
    this.sunlight = new THREE.DirectionalLight('#ffffff', 1)
    this.sunlight.castShadow = true
    this.sunlight.shadow.camera.far = 15
    this.sunlight.shadow.mapSize.set(1024, 1024)
    this.sunlight.shadow.normalBias = 0.05
    this.sunlight.position.set(3, 3, -2.25)

    this.scene.add(this.sunlight)

    //Debug
    if (this.debug.active && this.showDebug) {
      this.debugFolder
        .add(this.sunlight, 'intensity')
        .min(0)
        .max(10)
        .step(0.001)
        .name('sunLightIntensity')

      this.debugFolder
        .add(this.sunlight.position, 'x')
        .min(-5)
        .max(5)
        .step(0.001)
        .name('sunLightX')

      this.debugFolder
        .add(this.sunlight.position, 'y')
        .min(-5)
        .max(5)
        .step(0.001)
        .name('sunLightY')

      this.debugFolder
        .add(this.sunlight.position, 'z')
        .min(-5)
        .max(5)
        .step(0.001)
        .name('sunLightZ')
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

    this.scene.environment = this.environmentMap.texture

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }

    this.environmentMap.updateMaterials()

    //Debug
    if (this.debug.active && this.showDebug) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials)
    }
  }
}
