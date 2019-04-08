import * as THREE from 'three';

export default class Run {

    private fov: number = 45;
    private aspect: number = window.innerWidth / window.innerHeight;
    private near: number = 0.1;
    private far: number = 1000;
    private camera: any;
    private scene: any;
    private renderer: any;
    private cube: any;

    constructor() {
        this.Init(this.fov, this.aspect, this.near, this.far);
    }

    private Init(fov: number, aspect: number, near: number, far: number) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        this.camera.position.z = 5;
        this.animate();
    }

    private animate = () => {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene, this.camera);
        }
}
