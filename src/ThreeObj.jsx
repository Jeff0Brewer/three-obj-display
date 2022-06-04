import { onMount, onCleanup, createEffect } from 'solid-js'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import './ThreeObj.css'

const ThreeObj = props => {
    let canvRoot;
    let renderer;
    let element;

    const camera = new THREE.PerspectiveCamera(70, props.width/props.height, .01, Math.max(...props.cameraPosition)*2);
    camera.position.set(...props.cameraPosition);

    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 50, 0);
    scene.add(ambientLight);
    scene.add(pointLight);

    const rotationSpeed = .005;
    let mouseDown = false;
    let lastMouse = {
        x: 0,
        y: 0
    };
    window.addEventListener('mousedown', () => { mouseDown = true; });
    window.addEventListener('mouseup', () => { mouseDown = false; });
    window.addEventListener('mousemove', e => {
        if(!mouseDown || !element) return;
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        element.rotation.y += Math.sign(dx) * dist * rotationSpeed;
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
    });

    onMount(() => {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(props.width, props.height);
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
        canvRoot.appendChild(renderer.domElement);

        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load(
            props.mtlPath,
            materials => {
                materials.side = THREE.DoubleSide;
                materials.preload();
                objLoader.setMaterials(materials);

                objLoader.load(
                    props.objPath,
                    obj => {
                        element = obj;
                        element.position.set(...props.modelOffset);
                        scene.add(element); 
                    },
                    xhr => console.log(`.obj ${xhr.loaded / xhr.total * 100}% loaded`),
                    err => console.log(err)
                );

            },
            xhr => console.log(`.mtl ${xhr.loaded / xhr.total * 100}% loaded`),
            err => console.log(err)
        );
    });

    onCleanup(() => {
        renderer.setAnimationLoop(null);
    });

    return (
        <div ref={canvRoot}></div>
    );
}

export default ThreeObj;
