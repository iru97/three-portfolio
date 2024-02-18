import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const gui = new dat.GUI();
const world = {
    plane: {
        width: 10,
        height: 10,
        widthSegments: 10,
        heightSegments: 10
    }
};
gui.add(world.plane, 'width', 1, 20).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'height', 1, 20).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'widthSegments', 1, 50).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'heightSegments', 1, 50).
    onChange(() => {
        generatePlane();
    }); 

const scene = new THREE.Scene();
const camera = new THREE
    .PerspectiveCamera(75, innerWidth/ innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);

/* The line `renderer.setPixelRatio(devicePixelRatio);` in the provided JavaScript code snippet is
setting the pixel ratio of the renderer to match the device pixel ratio. This is important for
ensuring that the rendering output is displayed correctly on devices with different pixel densities,
such as high-DPI displays. */
renderer.setPixelRatio(devicePixelRatio);

camera.aspect = window.innerWidth / window.innerHeight;

const controls = new OrbitControls( camera, renderer.domElement );

document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const planeGeometry = new THREE
    .PlaneGeometry(
        10, 10, 10, 10
    );
const planeMaterial = new THREE
    .MeshPhongMaterial({
        color: 0x6495ED,
        side: THREE.DoubleSide,
        flatShading: true
    });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(planeMesh);

setVerticesPosition();

const light = new THREE.DirectionalLight(
    0xffffff, 1
);
light.position.set(0, 0, 1);
scene.add(light);
/* const ambientLight = new THREE.AmbientLight(
    0xffffff, 1
); */
controls.update();

/**
 * The `animate` function uses `requestAnimationFrame` to continuously render the scene with the camera
 * and potentially update the rotation of a plane mesh.
 */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //planeMesh.rotation.x += 0.01;
}

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );

    setVerticesPosition();
}

function setVerticesPosition() {
    /* This code snippet is iterating over the positions of vertices in the geometry of a plane mesh
    (`planeMesh`) and modifying the z-coordinate of each vertex by adding a random value to it. Here's a
    breakdown of what it's doing: */
    const { array: planeMeshPositions } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < planeMeshPositions.length; i+= 3) {
        const x = planeMeshPositions[i];
        const y = planeMeshPositions[i + 1];
        const z = planeMeshPositions[i + 2 ];

        planeMeshPositions[i + 2] = z + Math.random()
        
    }
}

/**
 * The function `onWindowResize` adjusts the camera aspect ratio, updates the projection matrix,
 * resizes the renderer, sets the pixel ratio, and updates the controls.
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    controls.update();

	animate()
}

window.addEventListener('resize', onWindowResize, false);

animate();
/* console.log(scene, camera, renderer) */