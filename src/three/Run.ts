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

    public TestAnimate() {
        // 立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.animate();
    }

    public animate = () => {
        this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    public LoadModel(url: string) {
        const loader = new THREE.ObjectLoader();
        loader.load(url, (obj) => {
            obj.scale.x = obj.scale.y = obj.scale.z = 0.1;
            this.scene.add(obj);
        });
    }

    private Init(fov: number, aspect: number, near: number, far: number) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;


        const pointColor = '#ffbe80';
        const pointLight = new THREE.PointLight(pointColor);
        pointLight.distance = 1;
        pointLight.intensity = 20; // 光强度的倍数,设为0则无灯光
        this.scene.add(pointLight);

    }


}
