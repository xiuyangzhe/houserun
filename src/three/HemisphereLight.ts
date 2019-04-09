import * as THREE from 'three';
import FBXLoader from 'three-fbxloader-offical';
import OrbitControls from 'three-orbitcontrols';
/// <refrence path="plugin/stats.d.ts">;
/// <refrence path="plugin/Types.d.ts">;

export default class HemisphereLight {

    private fov: number = 45;
    private aspect: number = window.innerWidth / window.innerHeight;
    private near: number = 1;
    private far: number = 5000;
    private camera: any;
    private scene: any;
    private renderer: any;
    private stats: any;
    private element: any;
    private hemiLight: any;
    private clock: any;
    private mixers: any[];
    private mixer: any;
    private model: any;

    constructor(element: any) {
        this.mixers = new Array<any>();
        this.element = element;
        this.Init(this.fov, this.aspect, this.near, this.far);

        this.clock = new THREE.Clock();
        this.animate();
    }

    public LoadModel(url: string) {
        // model

        const geometry = new THREE.BoxGeometry(10, 10, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y -= 10;
        // his.scene.add(cube);

        const loader = new FBXLoader();
        loader.load(url, (object) => {
            this.model = object;
            object.position.z -= 400;
            this.mixer = new THREE.AnimationMixer( object );
            const action = this.mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.traverse(( child ) => {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            this.scene.add( object );
        });
    }

    private Init(fov: number, aspect: number, near: number, far: number) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set( 100, 200, 300 );
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        // LIGHTS
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);


        // GROUND
        const groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
        const groundMat = new THREE.MeshLambertMaterial({color: 0xffffff});
        groundMat.color.setHSL(0.095, 1, 0.75);
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -33;
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Render
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;

        this.element.appendChild(this.renderer.domElement);

        // STATS 显示帧数
        this.stats = new Stats();
        this.element.appendChild(this.stats.dom);

        window.addEventListener('resize', this.onWindowResize, false);

        // control
        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
    }

    private onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.render();

    }

    private render = () => {
        const delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }
        this.renderer.render( this.scene, this.camera );
        this.stats.update();
    }


}
