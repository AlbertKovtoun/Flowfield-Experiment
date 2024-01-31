import * as THREE from "three"

import particlesVertexShader from "../../shaders/particles/vertex.glsl?raw"
import particlesFragmentShader from "../../shaders/particles/fragment.glsl?raw"
import { scene } from "./Experience"

export class Particles {
  constructor() {
    this.setParticles()
  }

  setParticles() {
    const particleCount = 100000

    const geometry = new THREE.BufferGeometry()

    const positions = []
    const positionVectors = []
    const randoms = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    const n = 2,
      n2 = n / 2 // particles spread in the sphere + put sphere in center

    for (let i = 0; i < particleCount; i++) {
      // positions
      const x = Math.random() * n - n2
      const y = Math.random() * n - n2
      const z = Math.random() * n - n2

      positionVectors.push(new THREE.Vector3(x, y, z))
      positions.push(x, y, z)

      // randoms
      randoms[i] = Math.random()

      //velocities
      velocities[i * 3] = Math.random() - 0.5 // x
      velocities[i * 3 + 1] = Math.random() - 0.5 // y
      velocities[i * 3 + 2] = Math.random() - 0.5 // z
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    )
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))
    geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3))

    geometry.computeBoundingSphere()

    this.particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      depthWrite: false,

      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
    })

    this.particlesPoints = new THREE.Points(geometry, this.particlesMaterial)
    scene.add(this.particlesPoints)
  }

  update(elapsedTime) {
    this.particlesMaterial.uniforms.uTime.value = elapsedTime
  }
}
