import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const INITIAL_PLANE_COLORS = { r: 0, g: 0.19, b: 0.6 };
const HOVER_PLANE_COLORS = { r: 0.1, g: 0.5, b: 1 };

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE
    .PerspectiveCamera(75, innerWidth/ innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const gui = new dat.GUI();
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50
    }
};

const planeGeometry = new THREE
    .PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments,
    );

const planeMaterial = new THREE
    .MeshPhongMaterial({
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: true
    });

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

const light = new THREE.DirectionalLight(
    0xffffff, 1
);

const backLight = new THREE.DirectionalLight(
    0xffffff, 1
);

const controls = new OrbitControls( camera, renderer.domElement );

let mouse = {
    x: undefined,
    y: undefined
};

gui.add(world.plane, 'width', 1, 500).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'height', 1, 500).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'widthSegments', 1, 100).
    onChange(() => {
        generatePlane();
    }); 
gui.add(world.plane, 'heightSegments', 1, 100).
    onChange(() => {
        generatePlane();
    });

camera.aspect = window.innerWidth / window.innerHeight;
camera.position.z = 50;

light.position.set(0, 1, 1);
backLight.position.set(0, 0, -1);

    /* The code snippet `for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0, 1);
    }` is iterating over the positions of vertices in the geometry of a plane mesh (`planeMesh`) and
    pushing color values into an array named `colors`. */
    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(
            INITIAL_PLANE_COLORS.r,
            INITIAL_PLANE_COLORS.g,
            INITIAL_PLANE_COLORS.b
        );
    }

    planeMesh.geometry.setAttribute('color',
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
setVerticesPosition();

scene.add(planeMesh);
scene.add(light);
scene.add(backLight);

controls.update();

renderer.setSize(innerWidth, innerHeight);

/* The line `renderer.setPixelRatio(devicePixelRatio);` in the provided JavaScript code snippet is
setting the pixel ratio of the renderer to match the device pixel ratio. This is important for
ensuring that the rendering output is displayed correctly on devices with different pixel densities,
such as high-DPI displays. */
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);
let frame = 0;
animate();

/**
 * The `animate` function uses `requestAnimationFrame` to continuously render the scene with the camera
 * and potentially update the rotation of a plane mesh.
 */

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    frame += 0.01;
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        // x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01
        // y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i]) * 0.01
        
        planeMesh.geometry.attributes.position.needsUpdate = true;
    }

    const intersects = raycaster.intersectObject(planeMesh);
   
    if (intersects.length > 0) {
        const hover = {...HOVER_PLANE_COLORS};
        setVerticesColor(intersects[0], HOVER_PLANE_COLORS);
       gsap.to(hover, {
        ...INITIAL_PLANE_COLORS,
        duration: 1,
        onUpdate: () => {
            setVerticesColor(intersects[0], hover)
        }
       })
    }
}

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );
    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(
            INITIAL_PLANE_COLORS.r,
            INITIAL_PLANE_COLORS.g,
            INITIAL_PLANE_COLORS.b
        );
    }

    planeMesh.geometry.setAttribute('color',
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
    setVerticesPosition();
}

function setVerticesPosition() {
    /* This code snippet is iterating over the positions of vertices in the geometry of a plane mesh
    (`planeMesh`) and modifying the z-coordinate of each vertex by adding a random value to it. Here's a
    breakdown of what it's doing: */
    const { array: planeMeshPositions } = planeMesh.geometry.attributes.position;
    const randomValues = [];
    for (let i = 0; i < planeMeshPositions.length; i++) {
        if(i % 3 === 0) {
            const x = planeMeshPositions[i];
            const y = planeMeshPositions[i + 1];
            const z = planeMeshPositions[i + 2 ];

            planeMeshPositions[i] = x + (Math.random() - 0.5) * 3;
            planeMeshPositions[i + 1] = y + (Math.random() - 0.5) * 3;
            planeMeshPositions[i + 2] = z + (Math.random() - 0.5) * 3;
        }
       randomValues.push(Math.random() * Math.PI * 2)
    }
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
    planeMesh.geometry.attributes.position.randomValues = randomValues;
}

function setVerticesColor(intersect, colors) {
    const { color } =   intersect.object.geometry.attributes;
    color.setX(intersect.face.a, colors.r);
    color.setY(intersect.face.a, colors.g);
    color.setZ(intersect.face.a, colors.b);

    color.setX(intersect.face.b, colors.r);
    color.setY(intersect.face.b, colors.g);
    color.setZ(intersect.face.b, colors.b);

    color.setX(intersect.face.c, colors.r);
    color.setY(intersect.face.c, colors.g);
    color.setZ(intersect.face.c, colors.b);

    color.needsUpdate = true;
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

/**
 * The function `normalizeMouseCoords` normalizes mouse coordinates to a range of -1 to 1 based on the
 * window dimensions.
 * @returns The function `normalizeMouseCoords` takes an object with `x` and `y` properties as its
 * argument. It then normalizes the mouse coordinates based on the inner width and inner height of the
 * window, and returns an object with normalized `x` and `y` values.
 */
function normalizeMouseCoords({x, y}) {
    return {
        x: (x / innerWidth) * 2 - 1,
        y: -(y / innerHeight) * 2 + 1
    }
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', (event) => {
    mouse = normalizeMouseCoords({x: event.clientX, y: event.clientY});
});
/* console.log(scene, camera, renderer) */