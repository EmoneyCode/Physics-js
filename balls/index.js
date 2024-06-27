import * as THREE from "three";
import { getBody, getMouseBall } from "./getBodies.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

let mousePos = new THREE.Vector2();

await RAPIER.init();
const gravity = { x: 0.0, y: 0, z: 0.0 }
const world = new RAPIER.World(gravity);

const numBodies = 250;
const bodies = [];
for (let i = 0; i < numBodies; i++){
    const body = getBody(RAPIER, world);
    bodies.push(body);
    scene.add(body.mesh);
}

const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
hemiLight.intensity = 0.2;
scene.add(hemiLight);



function animate(){
    requestAnimationFrame(animate);
    world.step();
    mouseBall.update(mousePos);
    bodies.forEach(b => b.update());
    renderer.render(scene, camera);
    //controls.update();
}

animate();

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
  
// mouse move handler
function handleMouseMove (evt) {
    mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, false);

