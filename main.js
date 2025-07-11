import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- グローバル変数 ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetPlanet = null;
const sunPosition = new THREE.Vector3(0, 0, 0);

// --- 初期設定 ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 80, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- カメラコントローラー ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

controls.addEventListener('start', () => { controls.autoRotate = false; });
controls.addEventListener('end', () => { controls.autoRotate = true; });

// --- ライト ---
const ambientLight = new THREE.AmbientLight(0xffffff, 3.0); // 環境光を調整
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 15, 2000); // 点光源を非常に明るく
scene.add(pointLight);

// --- オブジェクト作成 ---
// 星空 (パーティクルで生成)
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
const clearZoneRadius = 700; // 太陽系の周辺から星を消す半径
const maxStarDistance = 1000; // 星の最大生成距離

for (let i = 0; i < 10000; i++) {
    let x, y, z, distance;
    do {
        x = (Math.random() - 0.5) * maxStarDistance * 2;
        y = (Math.random() - 0.5) * maxStarDistance * 2;
        z = (Math.random() - 0.5) * maxStarDistance * 2;
        distance = Math.sqrt(x * x + y * y + z * z);
    } while (distance < clearZoneRadius);
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xff8c00 }); // 太陽を鮮やかなオレンジに
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetsData = [
    { name: 'Mercury', color: 0xff00ff, radius: 0.38, distance: 7.8, speed: 0.0416 }, // マゼンタ
    { name: 'Venus', color: 0x00ffff, radius: 0.95, distance: 14.4, speed: 0.0161 }, // シアン
    { name: 'Earth', color: 0x00ff00, radius: 1, distance: 20, speed: 0.01 }, // ネオングリーン
    { name: 'Mars', color: 0xff0000, radius: 0.53, distance: 30.4, speed: 0.0053 }, // ネオンレッド
    { name: 'Jupiter', color: 0xffff00, radius: 4, distance: 104, speed: 0.00084 }, // ネオンイエロー
    { name: 'Saturn', color: 0xffa500, radius: 3.5, distance: 191.6, speed: 0.00034, hasRing: true }, // ネオンオレンジ
    { name: 'Uranus', color: 0x00aaff, radius: 2, distance: 384.6, speed: 0.000119 }, // ネオンブルー
    { name: 'Neptune', color: 0x800080, radius: 1.9, distance: 602, speed: 0.00006 }, // パープル
];

const planets = [];

planetsData.forEach(data => {
    const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: data.color }); // 惑星の材質をBasicに変更
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = data.distance;

    const orbitGeometry = new THREE.TorusGeometry(data.distance, 0.1, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.radius + 1.5, data.radius + 6, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: data.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }); // 環もBasicに変更
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        planet.add(ring);
    }

    const planetObject = new THREE.Object3D();
    planetObject.add(planet);
    scene.add(planetObject);

    planets.push({ mesh: planet, object: planetObject, speed: data.speed });
});

// --- イベントリスナー ---
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousedown', onMouseDown, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        targetPlanet = intersects[0].object;
    } else {
        targetPlanet = null;
    }
}

// --- アニメーションループ ---
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(p => {
        p.object.rotation.y += p.speed;
        p.mesh.rotation.y += 0.005;
    });

    if (targetPlanet) {
        const targetPosition = new THREE.Vector3();
        targetPlanet.getWorldPosition(targetPosition);
        controls.target.lerp(targetPosition, 0.1);
    } else {
        controls.target.lerp(sunPosition, 0.1);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();