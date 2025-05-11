import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

// === 登入用的使用者資料 ===
//A何敏華B林昀蒨C黃文鶯D鄭伊嵐E詹永和F羅文均G賴奕傑H李承修
// 6  7  8  9 10 26
//27 28 29 30 31 32
const userCards = {
  何敏華: {
    topLayer: [
      'assets/A/11.jpg','assets/A/12.jpg','assets/A/13.jpg','assets/A/14.jpg','assets/A/15.jpg','assets/A/16.jpg','assets/A/17.jpg','assets/A/18.jpg'
    ],
    midLayer: [
      'assets/A/1.jpg','assets/A/2.jpg','assets/A/3.jpg','assets/A/5.jpg','assets/A/27.jpg','assets/A/28.jpg','assets/A/29.jpg','assets/A/30.jpg','assets/A/31.jpg'
    ],
    bottomLayer: [
      'assets/A/19.jpg','assets/A/20.jpg','assets/A/21.jpg','assets/A/22.jpg','assets/A/23.jpg','assets/A/24.jpg','assets/A/25.jpg','assets/A/32.jpg'
    ]
  },
  林昀蒨: {
    topLayer: [
      'assets/B/11.jpg','assets/B/12.jpg','assets/B/13.jpg','assets/B/14.jpg','assets/B/15.jpg','assets/B/16.jpg','assets/B/17.jpg','assets/B/18.jpg'
    ],
    midLayer: [
      'assets/B/1.jpg','assets/B/2.jpg','assets/B/3.jpg','assets/B/4.jpg','assets/B/5.jpg','assets/B/27.jpg','assets/B/28.jpg','assets/B/29.jpg','assets/B/30.jpg','assets/B/31.jpg'
    ],
    bottomLayer: [
      'assets/B/19.jpg','assets/B/20.jpg','assets/B/21.jpg','assets/B/22.jpg','assets/B/23.jpg','assets/B/24.jpg','assets/B/25.jpg','assets/B/32.jpg'
    ]
  },
  黃文鶯: {
    topLayer: [
      'assets/C/11.jpg','assets/C/12.jpg','assets/C/13.jpg','assets/C/14.jpg','assets/C/15.jpg','assets/C/16.jpg','assets/C/17.jpg','assets/C/18.jpg'
    ],
    midLayer: [
      'assets/C/1.jpg','assets/C/2.jpg','assets/C/3.jpg','assets/C/4.jpg','assets/C/5.jpg','assets/C/27.jpg','assets/C/28.jpg','assets/C/29.jpg','assets/C/30.jpg','assets/C/31.jpg'
    ],
    bottomLayer: [
      'assets/C/19.jpg','assets/C/20.jpg','assets/C/21.jpg','assets/C/22.jpg','assets/C/23.jpg','assets/C/24.jpg','assets/C/25.jpg','assets/C/32.jpg'
    ]
  },
  鄭伊嵐: {
    topLayer: [
      'assets/D/11.jpg','assets/D/12.jpg','assets/D/13.jpg','assets/D/14.jpg','assets/D/15.jpg','assets/D/16.jpg','assets/D/17.jpg','assets/D/18.jpg'
    ],
    midLayer: [
      'assets/D/1.jpg','assets/D/2.jpg','assets/D/3.jpg','assets/D/4.jpg','assets/D/5.jpg','assets/D/27.jpg','assets/D/28.jpg','assets/D/29.jpg','assets/D/30.jpg','assets/D/31.jpg'
    ],
    bottomLayer: [
      'assets/D/19.jpg','assets/D/20.jpg','assets/D/21.jpg','assets/D/22.jpg','assets/D/23.jpg','assets/D/24.jpg','assets/D/25.jpg','assets/D/32.jpg'
    ]
  },
  詹永和: {
    topLayer: [
      'assets/E/11.jpg','assets/E/12.jpg','assets/E/13.jpg','assets/E/14.jpg','assets/E/15.jpg','assets/E/16.jpg','assets/E/17.jpg','assets/E/18.jpg'
    ],
    midLayer: [
      'assets/E/1.jpg','assets/E/2.jpg','assets/E/3.jpg','assets/E/4.jpg','assets/E/5.jpg','assets/E/27.jpg','assets/E/28.jpg','assets/E/29.jpg','assets/E/30.jpg','assets/E/31.jpg'
    ],
    bottomLayer: [
      'assets/E/19.jpg','assets/E/20.jpg','assets/E/21.jpg','assets/E/22.jpg','assets/E/23.jpg','assets/E/24.jpg','assets/E/25.jpg','assets/E/32.jpg'
    ]
  },
  羅文均: {
    topLayer: [
      'assets/F/11.jpg','assets/F/12.jpg','assets/F/13.jpg','assets/F/14.jpg','assets/F/15.jpg','assets/F/16.jpg','assets/F/17.jpg','assets/F/18.jpg'
    ],
    midLayer: [
      'assets/F/1.jpg','assets/F/2.jpg','assets/F/3.jpg','assets/F/4.jpg','assets/F/5.jpg','assets/F/27.jpg','assets/F/28.jpg','assets/F/29.jpg','assets/F/30.jpg','assets/F/31.jpg'
    ],
    bottomLayer: [
      'assets/F/19.jpg','assets/F/20.jpg','assets/F/21.jpg','assets/F/22.jpg','assets/F/23.jpg','assets/F/24.jpg','assets/F/25.jpg','assets/F/32.jpg'
    ]
  },
  賴奕傑: {
    topLayer: [
      'assets/G/11.jpg','assets/G/12.jpg','assets/G/13.jpg','assets/G/14.jpg','assets/G/15.jpg','assets/G/16.jpg','assets/G/17.jpg','assets/G/18.jpg'
    ],
    midLayer: [
      'assets/G/1.jpg','assets/G/2.jpg','assets/G/3.jpg','assets/G/4.jpg','assets/G/5.jpg','assets/G/27.jpg','assets/G/28.jpg','assets/G/29.jpg','assets/G/30.jpg','assets/G/31.jpg'
    ],
    bottomLayer: [
      'assets/G/19.jpg','assets/G/20.jpg','assets/G/21.jpg','assets/G/22.jpg','assets/G/23.jpg','assets/G/24.jpg','assets/G/25.jpg','assets/G/32.jpg'
    ]
  },
  李承修: {
    topLayer: [
'assets/H/11.jpg','assets/H/12.jpg','assets/H/13.jpg','assets/H/14.jpg','assets/H/15.jpg','assets/H/16.jpg','assets/H/17.jpg','assets/H/18.jpg'
    ],
    midLayer: [
      'assets/H/1.jpg','assets/H/2.jpg','assets/H/3.jpg','assets/H/4.jpg','assets/H/5.jpg','assets/H/27.jpg','assets/H/28.jpg','assets/H/29.jpg','assets/H/30.jpg','assets/H/31.jpg'
    ],
    bottomLayer: [
      'assets/H/19.jpg','assets/H/20.jpg','assets/H/21.jpg','assets/H/22.jpg','assets/H/23.jpg','assets/H/24.jpg','assets/H/25.jpg','assets/H/32.jpg'
    ]
  }
};

// === 登入檢查邏輯 ===
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const msg = document.getElementById('login-msg');

  const copyBtn = document.getElementById('copy-name-btn');
  copyBtn.addEventListener('click', () => {
    const name = document.getElementById('name-helper').value.trim();
    document.getElementById('password').value = name;
});


  loginBtn.addEventListener('click', () => {
    const acc = document.getElementById('account').value.trim();
    const pwd = document.getElementById('password').value.trim();

    if (acc !== '315') {
      msg.textContent = '帳號錯誤';
      return;
    }

    if (!userCards[pwd]) {
      msg.textContent = '找不到這個名字，Who are you?';
      return;
    }

    // 隱藏登入畫面和輔助欄位
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('name-helper-box').style.display = 'none';

const userData = userCards[pwd];
if (userData.topLayer && userData.midLayer && userData.bottomLayer) {
  topLayer = userData.topLayer;
  midLayer = userData.midLayer;
  bottomLayer = userData.bottomLayer;
}


createLayeredCardPositions();
  });
});



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 14;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 20;
controls.minDistance = 5;

scene.add(new THREE.AmbientLight(0xffffff, 2.3));

const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff5533, transparent: true, opacity: 0 });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);

const bgGeometry = new THREE.SphereGeometry(50, 64, 64);
const bgTexture = new THREE.TextureLoader().load('assets/bg.jpg');
const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture, side: THREE.BackSide, transparent: true, opacity: 0 });
const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(backgroundSphere);

const cardGroup = new THREE.Group();
scene.add(cardGroup);

let topLayer = [];
let midLayer = [];
let bottomLayer = [];

function createCard(pos, imgUrl) {
  const image = new Image();
  image.src = imgUrl;
  image.onload = () => {
    const aspectRatio = image.width / image.height;
    const geo = new THREE.PlaneGeometry(1.6 * aspectRatio, 1.6);
    const texture = new THREE.TextureLoader().load(imgUrl);
    const mat = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, roughness: 0, metalness: 0.2 });
    const card = new THREE.Mesh(geo, mat);
    card.position.copy(pos);
    card.lookAt(0, 0, 0);
    card.rotateY(Math.PI);
    card.userData.original = {
      position: pos.clone(),
      scale: card.scale.clone(),
      rotation: card.rotation.clone()
    };
    cardGroup.add(card);
  };
}

function createLayeredCardPositions() {
  const R = 6;
  const layers = [
    { list: topLayer, phi: Math.PI / 3 },
    { list: midLayer, phi: Math.PI / 2 },
    { list: bottomLayer, phi: 2 * Math.PI / 3 }
  ];
  const spherical = new THREE.Spherical();
  const point = new THREE.Vector3();

  for (const { list, phi } of layers) {
    const count = list.length;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * 2 * Math.PI;
      spherical.set(R, phi, theta);
      point.setFromSpherical(spherical);
      createCard(point.clone(), list[i]);
    }
  }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let activeCard = null;
let isZoomed = false;

function resetActiveCard() {
  if (!activeCard) return;
  gsap.to(activeCard.position, {
    ...activeCard.userData.original.position,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      isZoomed = false;
      activeCard = null;
      controls.enabled = true;
    }
  });
  gsap.to(activeCard.scale, {
    x: 1, y: 1,
    duration: 1,
    ease: 'power2.inOut'
  });
  gsap.to(activeCard.rotation, {
    ...activeCard.userData.original.rotation,
    duration: 1,
    ease: 'power2.inOut'
  });
}

window.addEventListener('pointerdown', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cardGroup.children);

  if (intersects.length > 0) {
    const clickedCard = intersects[0].object;
    if (!isZoomed) {
      activeCard = clickedCard;
      isZoomed = true;
      controls.enabled = false;

      const dir = clickedCard.position.clone().normalize();
      const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 320;

      gsap.to(clickedCard.position, {
        x: dir.x * 5, y: dir.y * 5, z: dir.z * 5,
        duration: 0.5, ease: 'power2.inOut'
      });
      gsap.to(clickedCard.scale, {
        x: scaleFactor, y: scaleFactor,
        duration: 1, ease: 'power2.inOut'
      });
      gsap.to(bgMaterial, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
    } else if (activeCard === clickedCard) {
      resetActiveCard();
    }
  } else if (isZoomed) {
    resetActiveCard();
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isZoomed) resetActiveCard();
});

function animate() {
  requestAnimationFrame(animate);
  if (!isZoomed) {
    cardGroup.rotation.y += 0.005;
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();
