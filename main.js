import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE
    .PerspectiveCamera(75, innerWidth/ innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const planeGeometry = new THREE
    .PlaneGeometry(
        5, 5, 10, 10
    );
const planeMaterial = new THREE
    .MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        flatShading: true
    });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(planeMesh);

const { array: planeMeshPositions } = planeMesh.geometry.attributes.position;
for (let i = 0; i < planeMeshPositions.length; i+= 3) {
    const x = planeMeshPositions[i];
    const y = planeMeshPositions[i + 1];
    const z = planeMeshPositions[i + 2 ];

    planeMeshPositions[i + 2] = z + Math.random()
    
}
const light = new THREE.DirectionalLight(
    0xffffff, 1
);
light.position.set(0, 0, 1);
scene.add(light);
/* const ambientLight = new THREE.AmbientLight(
    0xffffff, 1
); */

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //planeMesh.rotation.x += 0.01;
}
animate();
/* console.log(scene, camera, renderer) */