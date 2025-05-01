import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

// === 登入用的使用者資料 ===
//A何敏華B林昀蒨C黃文鶯
const userCards = {
何敏華: {
topLayer: [
'assets/11.jpg','assets/12.jpg','assets/13.jpg','assets/14.jpg','assets/15.jpg','assets/16.jpg','assets/17.jpg','assets/18.jpg'
],
midLayer: [
'assets/1.jpg','assets/2.jpg','assets/3.jpg','assets/4.jpg','assets/5.jpg','assets/6.jpg','assets/7.jpg','assets/8.jpg','assets/9.jpg','assets/10.jpg'
],
bottomLayer: [
'assets/19.jpg','assets/20.jpg','assets/21.jpg','assets/22.jpg','assets/23.jpg','assets/24.jpg','assets/25.jpg','assets/26.jpg','assets/27.jpg'
]
},
林昀蒨:  {
topLayer: [
'assets/11.jpg','assets/12.jpg','assets/13.jpg','assets/14.jpg','assets/15.jpg','assets/16.jpg','assets/17.jpg','assets/18.jpg'
],
midLayer: [
'assets/1.jpg','assets/2.jpg','assets/3.jpg','assets/4.jpg','assets/5.jpg','assets/6.jpg','assets/7.jpg','assets/8.jpg','assets/9.jpg','assets/10.jpg'
],
bottomLayer: [
'assets/messageImage_1746012419804.jpg','assets/20.jpg','assets/21.jpg','assets/22.jpg','assets/23.jpg','assets/24.jpg','assets/25.jpg','assets/26.jpg','assets/27.jpg'
]
},

黃文鶯:  {
topLayer: [
'assets/11.jpg','assets/12.jpg','assets/13.jpg','assets/14.jpg','assets/15.jpg','assets/16.jpg','assets/17.jpg','assets/18.jpg'
],
midLayer: [
'assets/1.jpg','assets/2.jpg','assets/3.jpg','assets/4.jpg','assets/5.jpg','assets/6.jpg','assets/7.jpg','assets/8.jpg','assets/9.jpg','assets/10.jpg'
],
bottomLayer: [
'assets/19.jpg','assets/20.jpg','assets/21.jpg','assets/22.jpg','assets/23.jpg','assets/24.jpg','assets/25.jpg','assets/26.jpg','assets/27.jpg'
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
      msg.textContent = '找不到這個名字，請確認輸入或聯絡管理者';
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

const renderer = new THREE.WebGLRenderer({ antialias: true });
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
    onUpdate: () => activeCard.lookAt(0, 0, 0),
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
  gsap.to(bgMaterial, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
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
        x: dir.x * 10, y: dir.y * 10, z: dir.z * 10,
        duration: 1, ease: 'power2.inOut'
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
