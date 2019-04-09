import * as THREE from 'three';

/// <refrence path="plugin/stats.d.ts">;

export default class HemisphereLight {

    private fov: number = 30;
    private aspect: number = window.innerWidth / window.innerHeight;
    private near: number = 1;
    private far: number = 5000;
    private camera: any;
    private scene: any;
    private renderer: any;
    private stats: any;
    private element: any;

    constructor(element: any) {
        this.element = element;
        this.Init(this.fov, this.aspect, this.near, this.far);
    }

    private Init(fov: number, aspect: number, near: number, far: number) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 250);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;

        this.element.appendChild(this.renderer.domElement);

        // STATS 显示帧数
        this.stats = new Stats();
        this.element.appendChild( this.stats.dom );
    }
}
