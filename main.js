import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE
    .PerspectiveCamera(75, innerWidth/ innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE
    .BoxGeometry(
    1, 1, 1
);
const material = new THREE
    .MeshBasicMaterial({color: 0x09FF95});
const mesh = new THREE.Mesh(boxGeometry, material)

scene.add(mesh);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
}
animate();
/* console.log(scene, camera, renderer) */