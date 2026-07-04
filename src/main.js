import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ---- SCENE SETUP ----
const scene = new THREE.Scene()
scene.background = null

// ---- GRADIENT SKY ----
const skyGeometry = new THREE.SphereGeometry(500, 32, 32)
const skyMaterial = new THREE.ShaderMaterial({
  uniforms: {
    topColor:    { value: new THREE.Color('#c9cde9') }, // soft blue-grey top
    midColor:    { value: new THREE.Color('#a9aed1') }, // mid purple
    bottomColor: { value: new THREE.Color('#E8EBED') }, // Meringe horizon
    glowColor:   { value: new THREE.Color('#C8D4E5') }, // Buttercream glow
  },
  vertexShader: `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 midColor;
    uniform vec3 bottomColor;
    uniform vec3 glowColor;
    varying vec3 vPosition;

    void main() {
      float h = normalize(vPosition).y;

      vec3 color;
      if (h > 0.0) {
        color = mix(midColor, topColor, h);
      } else {
        color = mix(midColor, bottomColor, -h);
      }

      float glow = 1.0 - abs(h) * 1.8;
      glow = max(0.0, glow);
      glow = pow(glow, 2.0);
      color = mix(color, glowColor, glow * 0.08);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  side: THREE.BackSide
})

const skySphere = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(skySphere)

// ---- STAR FIELD ----
function createStars() {
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 2000

  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)

  const starColors = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#c8d8ff'),
    new THREE.Color('#e8c8ff'),
    new THREE.Color('#ffd8e8'),
    new THREE.Color('#ffffc8'),
  ]

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 400 + Math.random() * 50

    positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const color = starColors[Math.floor(Math.random() * starColors.length)]
    colors[i * 3]     = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() < 0.9 ? Math.random() * 2.5 : Math.random() * 5 + 2.5
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
  return stars
}

const stars = createStars()

// ---- CAMERA ----
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-8, 18, -90)
camera.lookAt(0, 0, 0)

// ---- RENDERER ----
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
document.body.appendChild(renderer.domElement)

// ---- LIGHTING ----
const ambientLight = new THREE.AmbientLight('#bdb8e8', 0.7)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight('#fff5e0', 0.3)
sunLight.position.set(10, 20, 10)
scene.add(sunLight)

// Thesis island — at [-40, -6, -20]
const thesisLight = new THREE.PointLight('#ffb3d9',100, 500)
thesisLight.position.set(-45, 4, -20)
scene.add(thesisLight)

const thesisLight2 = new THREE.PointLight('#b68efb', 220, 40)
thesisLight2.position.set(-40, -1, -8)
scene.add(thesisLight2)

// Humly island — at [-25, 2, 30]
const humlyLight = new THREE.PointLight('#a0c8ff', 1000, 500)
humlyLight.position.set(-25, 12, 30)
scene.add(humlyLight)

const humlyLight2 = new THREE.PointLight('#9bb4f0', 2000, 400)
humlyLight2.position.set(-20, 4, 32)
scene.add(humlyLight2)

// Seed of Hope island — at [25, -14, 8]
const seedLight = new THREE.PointLight('#b4deef', 500, 50)
seedLight.position.set(25, 0, 8)
scene.add(seedLight)

const seedLight2 = new THREE.PointLight('#8089D2',100, 40)
seedLight2.position.set(29, -10, 12)
scene.add(seedLight2)

// Central platform — at [-2, -4, -20]
const platformLight = new THREE.PointLight('#f5d9d1', 50, 2000)
platformLight.position.set(-10, 10, -25)
scene.add(platformLight)

// ---- LOADING SCREEN ----
const loadingBar    = document.getElementById('loading-bar')
const loadingScreen = document.getElementById('loading-screen')
const loadingWords  = document.querySelectorAll('.loading-word')
const loadingHint   = document.querySelector('.loading-hint')

const loadingTl = gsap.timeline({ delay: 0.2 })
loadingWords.forEach((word) => {
  loadingTl.to(word, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.15')
})
loadingTl.to(loadingHint, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '+=0.1')

const manager = new THREE.LoadingManager()

manager.onProgress = (url, loaded, total) => {
  loadingBar.style.width = `${(loaded / total) * 100}%`
}

const minLoadTime = 4000
const loadStart = Date.now()

manager.onLoad = () => {
  loadingBar.style.width = '100%'
  const remaining = Math.max(0, minLoadTime - (Date.now() - loadStart))
  setTimeout(() => {
    loadingScreen.classList.add('hidden')
    setTimeout(() => playIntroAnimation(), 800)
  }, remaining + 600)
}

// ---- MODEL LOADER ----
const loader = new GLTFLoader(manager)

function loadModel(path, position, scale = 1) {
  return new Promise((resolve) => {
    loader.load(path, (gltf) => {
      const model = gltf.scene
      model.position.set(...position)
      model.scale.setScalar(scale)
      scene.add(model)
      resolve({ model, gltf })
    })
  })
}

// ---- LOAD ALL MODELS ----
const mixers = []

async function loadAllModels() {
  await loadModel('/models/CentralPlatformV2.glb', [-2, -4, -20], 1.5)

  const { gltf: thesisGltf, model: thesis } = await loadModel('/models/ThesisNEW.glb', [-40, -6, -20], 1)
  if (thesisGltf.animations.length > 0) {
    const thesisMixer = new THREE.AnimationMixer(thesis)
    thesisGltf.animations.forEach((clip) => thesisMixer.clipAction(clip).play())
    mixers.push(thesisMixer)
  }

  const { model: humly } = await loadModel('/models/HumlyNEW.glb', [-25, 2, 30], 1.2)
  humly.rotation.y = Math.PI / 4

  const { gltf: seedGltf, model: seed } = await loadModel('/models/SeedNEW.glb', [25, -14, 8], 1.4)
  if (seedGltf.animations.length > 0) {
    const seedMixer = new THREE.AnimationMixer(seed)
    seedGltf.animations.forEach((clip) => seedMixer.clipAction(clip).play())
    mixers.push(seedMixer)
  }

  const { gltf: characterGltf, model: character } = await loadModel('/models/characterNEW.glb', [-1, -4, -20], 1.1)
  if (characterGltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(character)
    mixer.clipAction(characterGltf.animations[0]).play()
    mixers.push(mixer)
  }
}

loadAllModels()

// ---- SCROLL-DRIVEN CAMERA JOURNEY ----
const cameraStops = [
  { position: { x: -8,    y: 18,   z: -90   }, lookAt: { x: 0,     y: 0,     z: 0    } }, // wide intro
  { position: { x: -4.2,  y: 13.3, z: -41.8 }, lookAt: { x: 1.0,   y: 1.5,   z: 0.7  } }, // character
  { position: { x: 15.1,  y: -6.9, z: -29.9 }, lookAt: { x: 52.9,  y: -24.3, z: 2.7  } }, // Seed of Hope
  { position: { x: -2.1,  y: 9.8,  z: 2.9   }, lookAt: { x: 11.0,  y: 1.5,   z: 38.4 } }, // Humly
  { position: { x: -22.4, y: -4.0, z: -34.7 }, lookAt: { x: -56.1, y: -20.9, z: 26.7 } }, // Thesis
  { position: { x: -8,    y: 18,   z: -90   }, lookAt: { x: 0,     y: 0,     z: 0    } }, // wide outro
]

const cameraState = {
  x: cameraStops[0].position.x,
  y: cameraStops[0].position.y,
  z: cameraStops[0].position.z,
  lookX: cameraStops[0].lookAt.x,
  lookY: cameraStops[0].lookAt.y,
  lookZ: cameraStops[0].lookAt.z,
}

const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.4,
  }
})

for (let i = 0; i < cameraStops.length - 1; i++) {
  const to = cameraStops[i + 1]
  scrollTimeline.to(cameraState, {
    x: to.position.x, y: to.position.y, z: to.position.z,
    lookX: to.lookAt.x, lookY: to.lookAt.y, lookZ: to.lookAt.z,
    ease: 'power1.inOut',
    duration: 1,
  })
}

// ---- RESIZE HANDLER ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---- TEXT OVERLAY ANIMATIONS ----
function fadePanel(id, trigger, start, peak, end) {
  const el = document.getElementById(id)
  gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub: 1 }
  })
  .to(el, { opacity: 1, duration: peak })
  .to(el, { opacity: 0, duration: 1 - peak })
}

// Stop 0 — Intro overlay fades out on scroll
gsap.to('#intro-overlay', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.stop:nth-child(1)',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
})

// Stop 1 — Character
fadePanel('char-left',  '.stop:nth-child(2)', 'top 80%', 0.6, 'bottom top')
fadePanel('char-right', '.stop:nth-child(2)', 'top 80%', 0.6, 'bottom top')

// Stop 2 — Seed of Hope
fadePanel('seed-panel',       '.stop:nth-child(3)', 'top 80%', 0.7, 'bottom top')
fadePanel('seed-video-panel', '.stop:nth-child(3)', 'top 80%', 0.7, 'bottom top')

// Stop 3 — Humly
fadePanel('humly-panel', '.stop:nth-child(4)', 'top 80%', 0.7, 'bottom top')

// Stop 4 — Thesis
fadePanel('thesis-left',  '.stop:nth-child(5)', 'top 80%', 0.6, '80% top')
fadePanel('thesis-right', '.stop:nth-child(5)', 'top 80%', 0.6, '80% top')

// Video play/pause tied to scroll visibility
const seedVideo = document.getElementById('seed-preview-video')
ScrollTrigger.create({
  trigger: '.stop:nth-child(3)',
  start: 'top 80%',
  end: 'bottom top',
  onEnter:     () => seedVideo.play().catch(() => {}),
  onLeave:     () => seedVideo.pause(),
  onEnterBack: () => seedVideo.play().catch(() => {}),
  onLeaveBack: () => seedVideo.pause(),
})

// Stop 5 — Outro
ScrollTrigger.create({
  trigger: '.stop:nth-child(6)',
  start: 'top bottom',
  onEnter:     () => playOutroAnimation(),
  onLeaveBack: () => resetOutro(),
})

function playOutroAnimation() {
  const words     = document.querySelectorAll('.outro-word')
  const outroName = document.querySelector('.outro-name')
  const sub       = document.querySelector('.outro-sub')
  const links     = document.querySelector('.outro-links')

  const tl = gsap.timeline()
  tl.to('#outro-overlay', { opacity: 1, duration: 0.3, ease: 'power2.out' })
  words.forEach((word) => {
    tl.to(word, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.08')
  })
  tl.to(outroName, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.1')
  tl.to(sub,       { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.1')
  tl.to(links,     { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.1')
}

function resetOutro() {
  gsap.set('#outro-overlay', { opacity: 0 })
  gsap.set('.outro-word',    { opacity: 0 })
  gsap.set('.outro-name',    { opacity: 0 })
  gsap.set('.outro-sub',     { opacity: 0 })
  gsap.set('.outro-links',   { opacity: 0 })
}

// ---- INTRO PANEL ENTRANCE ANIMATION ----
function playIntroAnimation() {
  const words      = document.querySelectorAll('.title-word')
  const subtitle   = document.querySelector('.fullscreen-overlay .subtitle')
  const tagline    = document.querySelector('.intro-tagline')
  const scrollHint = document.querySelector('.scroll-hint')

  const tl = gsap.timeline({ delay: 0.3 })
  words.forEach((word) => {
    tl.to(word, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '+=0.15')
  })
  tl.to(subtitle,   { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.2')
  tl.to(tagline,    { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.15')
  tl.to(scrollHint, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.2')
}

// ---- ANIMATION LOOP ----
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()
  mixers.forEach(mixer => mixer.update(delta))

  camera.position.set(cameraState.x, cameraState.y, cameraState.z)
  camera.lookAt(cameraState.lookX, cameraState.lookY, cameraState.lookZ)

  stars.rotation.y += 0.00005

  renderer.render(scene, camera)
}

animate()