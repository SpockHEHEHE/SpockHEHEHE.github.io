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



// === Three.js 主邏輯 ===
// 建立場景、相機和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 14;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 加入控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 加入環境光
scene.add(new THREE.AmbientLight(0xffffff, 2.3));

// 建立中心球體
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff5533,
//  wireframe: true,
  transparent: true,
  opacity: 0,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
// scene.add(sphere);

// 加入背景彩色球體
const bgGeometry = new THREE.SphereGeometry(50, 64, 64);
const bgTexture = new THREE.TextureLoader().load('assets/bg.jpg');
const bgMaterial = new THREE.MeshBasicMaterial({
  map: bgTexture,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0 // 初始隱藏
});
const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(backgroundSphere);

// 球體自轉速度參數
const rotationSpeed = 0.005;

// 建立卡片群組
const cardGroup = new THREE.Group();
scene.add(cardGroup);

// 圖片清單（依三層分組）
let topLayer = [];
let midLayer = []
let bottomLayer = [];

//card

function createCard(pos, imgUrl) {
  const image = new Image();
  image.src = imgUrl;
  image.onload = () => {
    const aspectRatio = image.width / image.height;
    const geo = new THREE.PlaneGeometry(2 * aspectRatio, 2);
    const texture = new THREE.TextureLoader().load(imgUrl);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.0,
      metalness: 0.2,
    });
    const card = new THREE.Mesh(geo, mat);
    card.position.copy(pos);
    card.lookAt(0, 0, 0);
    card.rotateY(Math.PI);
    card.userData.original = {
      position: pos.clone(),
      scale: card.scale.clone(),
      rotation: card.rotation.clone(),
    };
    cardGroup.add(card);
  };
}

function createLayeredCardPositions() {
  const R = 6;
  const layers = [
    { list: topLayer, phi: 3 * Math.PI / 9 },
    { list: midLayer, phi: Math.PI / 2 },
    { list: bottomLayer, phi: 6 * Math.PI / 9 }
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
createLayeredCardPositions();

// 點擊放大卡片
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let activeCard = true;
let isZoomed = false;

function resetActiveCard() {
  if (activeCard) {
    gsap.to(activeCard.position, {
      x: activeCard.userData.original.position.x,
      y: activeCard.userData.original.position.y,
      z: activeCard.userData.original.position.z,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        activeCard.lookAt(0, 0, 0);
        activeCard.rotation.y += Math.PI;
      },
      onComplete: () => {
        isZoomed = false;
        activeCard = null;
        controls.enabled = true;
      },
    });

    gsap.to(activeCard.scale, {
      x: 1,
      y: 1,
      duration: 1,
      ease: 'power2.inOut',
    });

    gsap.to(activeCard.rotation, {
      x: activeCard.userData.original.rotation.x,
      y: activeCard.userData.original.rotation.y,
      z: activeCard.userData.original.rotation.z,
      duration: 1,
      ease: 'power2.inOut',
    });

    // 背景淡出
    /*gsap.to(bgMaterial, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    });*/
  }
}

window.addEventListener('pointerdown', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cardGroup.children);

  if (intersects.length > 0) {
    const clickedCard = intersects[0].object;
    if (!isZoomed) {
      controls.enabled = false;
      activeCard = clickedCard;
      isZoomed = true;
      const cardToCenter = new THREE.Vector3().subVectors(clickedCard.position, new THREE.Vector3(0, 0, 0)).normalize();



      const moveDistance = 3;
      const distance = clickedCard.position.distanceTo(camera.position);
      const scaleFactor = Math.tan(Math.PI * camera.fov / 360) * distance;
      const scaleX = 3 / 9 * scaleFactor;
      const scaleY = 3 / 9 * scaleFactor;

      gsap.to(clickedCard.position, {
        x: cardToCenter.x * 3 * moveDistance,
        y: cardToCenter.y * 3 * moveDistance,
        z: cardToCenter.z * 3 * moveDistance,
        duration: 1,
        ease: 'power2.inOut',
      });

      gsap.to(clickedCard.scale, {
        x: scaleX,
        y: scaleY,
        duration: 1,
        ease: 'power2.inOut',
      });

      // 背景淡入
      gsap.to(bgMaterial, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.inOut'
      });

    } else if (activeCard === clickedCard) {
      resetActiveCard();
    }
  } else {
    if (isZoomed) resetActiveCard(); // 點擊空白處還原
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isZoomed) {
    resetActiveCard();
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  if (!isZoomed) {
    sphere.rotation.y += rotationSpeed;
    cardGroup.rotation.y += rotationSpeed;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();
