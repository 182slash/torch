'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function NetworkScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let isMounted = true

    // ─── Renderer ─────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    mount.appendChild(renderer.domElement)

    const isMobile = mount.clientWidth < 768

    // ─── Scene & Camera ───────────────────────────────────────────
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    )
    camera.position.set(0, 5, 12)
    camera.lookAt(0, 0, 0)

    const toDispose: (THREE.BufferGeometry | THREE.Material)[] = []

    // ─── Mouse interaction state ──────────────────────────────────
    // mouseWorld: cursor projected onto the wave plane (Y=0)
    const mouseWorld = { x: 99999, z: 99999 }
    let mouseInfluence = 0        // 0→1, lerps up on enter, down on leave
    const raycaster = new THREE.Raycaster()
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const planeHit = new THREE.Vector3()
    const ndcMouse = new THREE.Vector2(99999, 99999)

    // ─── WAVE GRID PARAMETERS ─────────────────────────────────────
    const COLS       = isMobile ? 36 : 60
    const ROWS       = isMobile ? 28 : 44
    const WIDTH      = 22
    const DEPTH      = 16
    const MAX_HEIGHT = 3.2

    const vertCount = COLS * ROWS

    // ─── Color palette ────────────────────────────────────────────
    function heightColor(nx: number, _ny: number, waveY: number): THREE.Color {
      const hue1 = new THREE.Color(0xff2244)
      const hue2 = new THREE.Color(0x00ccbb)
      const hue3 = new THREE.Color(0xff6600)
      const hue4 = new THREE.Color(0xaa00ff)
      const c = new THREE.Color()
      const heightFactor = (waveY + 1) * 0.5

      if (heightFactor > 0.7) {
        c.lerpColors(hue2, new THREE.Color(0xffffff), (heightFactor - 0.7) / 0.3)
      } else if (nx < 0.4) {
        c.lerpColors(new THREE.Color(0x881122), hue1, heightFactor * 1.4)
      } else if (nx > 0.6) {
        c.lerpColors(new THREE.Color(0x662200), hue3, heightFactor * 1.4)
      } else {
        c.lerpColors(hue4, hue2, heightFactor)
      }
      return c
    }

    // ─── Build grid geometry ──────────────────────────────────────
    const positions = new Float32Array(vertCount * 3)
    const colors    = new Float32Array(vertCount * 3)
    const baseX     = new Float32Array(vertCount)
    const baseZ     = new Float32Array(vertCount)

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col
        const nx  = col / (COLS - 1)
        const nz  = row / (ROWS - 1)
        const x   = (nx - 0.5) * WIDTH
        const z   = (nz - 0.5) * DEPTH

        baseX[idx] = x
        baseZ[idx] = z

        positions[idx * 3]     = x
        positions[idx * 3 + 1] = 0
        positions[idx * 3 + 2] = z

        const c = heightColor(nx, nz, 0)
        colors[idx * 3]     = c.r
        colors[idx * 3 + 1] = c.g
        colors[idx * 3 + 2] = c.b
      }
    }

    // ─── Grid line segments ───────────────────────────────────────
    const lineIndices: number[] = []
    for (let row = 0; row < ROWS; row++)
      for (let col = 0; col < COLS - 1; col++)
        lineIndices.push(row * COLS + col, row * COLS + col + 1)
    for (let col = 0; col < COLS; col++)
      for (let row = 0; row < ROWS - 1; row++)
        lineIndices.push(row * COLS + col, (row + 1) * COLS + col)

    const lineGeo  = new THREE.BufferGeometry()
    const posAttr   = new THREE.BufferAttribute(positions.slice(), 3)
    const colorAttr = new THREE.BufferAttribute(colors.slice(), 3)
    lineGeo.setAttribute('position', posAttr)
    lineGeo.setAttribute('color', colorAttr)
    lineGeo.setIndex(lineIndices)
    toDispose.push(lineGeo)

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.55,
    })
    toDispose.push(lineMat)
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    // ─── Intersection dots ────────────────────────────────────────
    const dotGeo       = new THREE.BufferGeometry()
    const dotPosAttr   = new THREE.BufferAttribute(positions.slice(), 3)
    const dotColorAttr = new THREE.BufferAttribute(colors.slice(), 3)
    dotGeo.setAttribute('position', dotPosAttr)
    dotGeo.setAttribute('color', dotColorAttr)
    toDispose.push(dotGeo)

    const dotMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: isMobile ? 0.12 : 0.10,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.92,
    })
    toDispose.push(dotMat)
    scene.add(new THREE.Points(dotGeo, dotMat))

    // ─── Bloom ────────────────────────────────────────────────────
    let composer: { render: () => void; setSize: (w: number, h: number) => void } | null = null
    ;(async () => {
      try {
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
        const { RenderPass }     = await import('three/examples/jsm/postprocessing/RenderPass.js')
        const { UnrealBloomPass }= await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
        if (!isMounted) return
        const c = new EffectComposer(renderer)
        c.addPass(new RenderPass(scene, camera))
        c.addPass(new UnrealBloomPass(
          new THREE.Vector2(mount.clientWidth, mount.clientHeight),
          1.4, 0.9, 0.05
        ))
        composer = c
      } catch { /* plain renderer */ }
    })()

    // ─── Mouse event listeners ────────────────────────────────────
    // IMPORTANT: listen on window not canvas — hero text overlays (z-10)
    // sit on top of the canvas and swallow pointer events otherwise.
    const canvas = renderer.domElement

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      // Only respond if cursor is within the canvas bounds
      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom
      ) {
        ndcMouse.set(99999, 99999)
        return
      }
      ndcMouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      ndcMouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
    }
    function onMouseLeave() {
      ndcMouse.set(99999, 99999)
      mouseWorld.x = 99999
      mouseWorld.z = 99999
    }
    function onTouchMove(e: TouchEvent) {
      if (!e.touches.length) return
      const rect = canvas.getBoundingClientRect()
      ndcMouse.x =  ((e.touches[0].clientX - rect.left) / rect.width)  * 2 - 1
      ndcMouse.y = -((e.touches[0].clientY - rect.top)  / rect.height) * 2 + 1
    }
    // Use window for mousemove so overlaying divs don't block it
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    // ─── Animation loop ───────────────────────────────────────────
    let rafId: number
    let cancelled = false
    const tmpColor = new THREE.Color()

    function getWaveHeight(x: number, z: number, t: number): number {
      const nx = x / WIDTH + 0.5
      const nz = z / DEPTH + 0.5

      // ── All wave frequencies reduced ~55% vs original ──────────
      // Original: t*0.9, t*0.6, t*0.5, t*0.7, t*1.2, t*0.8
      // Elegant:  t*0.4, t*0.27, t*0.22, t*0.32, t*0.54, t*0.36
      const w1 = Math.sin(nx * 4.5 + t * 0.40) * Math.cos(nz * 3.2 + t * 0.27)
      const w2 = Math.sin(nx * 2.8 - t * 0.22) * Math.sin(nz * 4.8 + t * 0.32)
      const w3 = Math.cos(nx * 6.0 + t * 0.54) * 0.3
      const w4 = Math.sin((nx + nz) * 3.5 - t * 0.36) * 0.25

      const raw   = (w1 * 0.45 + w2 * 0.35 + w3 + w4) * MAX_HEIGHT
      const sweep = Math.sin(nx * Math.PI * 0.8 + 0.3) * Math.sin(nz * Math.PI * 0.6 + 0.5) * 1.8
      return raw + sweep
    }

    function animate() {
      if (cancelled) return
      rafId = requestAnimationFrame(animate)

      const t = Date.now() * 0.001

      // ── Project cursor onto wave plane ────────────────────────
      if (ndcMouse.x < 999) {
        raycaster.setFromCamera(ndcMouse, camera)
        if (raycaster.ray.intersectPlane(mousePlane, planeHit)) {
          mouseWorld.x = planeHit.x
          mouseWorld.z = planeHit.z
        }
        mouseInfluence = Math.min(1, mouseInfluence + 0.025)  // slow fade in
      } else {
        mouseInfluence = Math.max(0, mouseInfluence - 0.018)  // slow fade out
      }

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col
          const nx  = col / (COLS - 1)
          const nz  = row / (ROWS - 1)
          const x   = baseX[idx]
          const z   = baseZ[idx]
          const y   = getWaveHeight(x, z, t)

          // ── Cursor ripple displacement ──────────────────────────
          const dx = x - mouseWorld.x
          const dz = z - mouseWorld.z
          const distSq = dx * dx + dz * dz
          const RIPPLE_R = 6.0          // wider, softer falloff radius
          const rippleRaw = Math.max(0, 1 - distSq / (RIPPLE_R * RIPPLE_R))
          const rippleFalloff = rippleRaw * rippleRaw  // smooth quadratic
          // Gentle swell — slower speed, lower amplitude
          const rippleDist = Math.sqrt(distSq)
          const rippleWave = Math.sin(rippleDist * 1.0 - t * 1.8) * rippleFalloff * 0.55
          const finalY = y + rippleWave * mouseInfluence

          posAttr.setXYZ(idx, x, finalY, z)
          dotPosAttr.setXYZ(idx, x, finalY, z)

          const normH     = finalY / MAX_HEIGHT
          tmpColor.set(heightColor(nx, nz, normH))

          // Subtle brightness lift near cursor — not a harsh spotlight
          const cursorBright = rippleFalloff * mouseInfluence * 0.35
          const brightness = Math.min(1.4, 0.6 + Math.max(0, normH) * 0.4 + cursorBright)
          colorAttr.setXYZ(idx, tmpColor.r * brightness, tmpColor.g * brightness, tmpColor.b * brightness)
          dotColorAttr.setXYZ(
            idx,
            Math.min(1, tmpColor.r * (brightness + cursorBright * 0.2)),
            Math.min(1, tmpColor.g * (brightness + cursorBright * 0.2)),
            Math.min(1, tmpColor.b * (brightness + cursorBright * 0.2))
          )
        }
      }

      posAttr.needsUpdate      = true
      dotPosAttr.needsUpdate   = true
      colorAttr.needsUpdate    = true
      dotColorAttr.needsUpdate = true
      lineGeo.computeBoundingSphere()
      dotGeo.computeBoundingSphere()

      // ── Camera drift also slowed ~55% ──────────────────────────
      // Original: t*0.04, t*0.03 → now t*0.018, t*0.014
      camera.position.x = Math.sin(t * 0.018) * 1.2
      camera.position.y = 5 + Math.sin(t * 0.014) * 0.6
      camera.lookAt(0, 0.5, 0)

      composer ? composer.render() : renderer.render(scene, camera)
    }

    animate()

    // ─── Resize ───────────────────────────────────────────────────
    function onResize() {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      composer?.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ─── Cleanup ──────────────────────────────────────────────────
    return () => {
      isMounted = false
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      toDispose.forEach(i => i.dispose())
      renderer.dispose()
      if (mount?.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}