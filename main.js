import * as THREE from "/three.module.min.js";

const utah_req = fetch("utah.bin");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

let teapot = null;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.domElement.id = "teapot";
document.body.prepend(renderer.domElement);

const material = new THREE.MeshNormalMaterial();

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

utah_req.then(async res => {
    const vertex_count = 530;
    const face_count = 992;

    if (!res.ok) {
        console.error("Couldn't fetch teapot.");
        return;
    }

    const buffer = await res.arrayBuffer();
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(buffer, 0, 3*vertex_count);
    const normals = new Float32Array(buffer, 4*3*vertex_count, 3*vertex_count);
    const indices = new Uint16Array(buffer, 2*4*3*vertex_count, 3*face_count);

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

    teapot = new THREE.Mesh(geometry, material);

    teapot.scale.x *= 0.1;
    teapot.scale.y *= 0.1;
    teapot.scale.z *= 0.1;

    scene.add(teapot);
});

camera.position.z = 5;
function animate(timestamp) {
    if (teapot) {
        teapot.rotation.x = -0.01/30 * timestamp;
        teapot.rotation.y = 0.005/30 * timestamp;
    }
    renderer.render(scene, camera);
}
