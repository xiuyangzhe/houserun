import * as THREE from 'three';
import FBXLoader from 'three-fbxloader-offical';
import OrbitControls from 'three-orbitcontrols';
/// <refrence path="plugin/stats.d.ts">;
/// <refrence path="plugin/Types.d.ts">;

interface RunModel {
    mixer: any;
    model: any;
    moveType: MoveType;

}

export enum MoveType {
    X,
    Y,
    Z
}

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
    private models: RunModel[];
    private modelX: number = 1000;
    private groundY: number = -500;

    constructor(element: any) {
        this.models = new Array<RunModel>();
        this.element = element;
        this.Init(this.fov, this.aspect, this.near, this.far);

        this.clock = new THREE.Clock();
        this.animate();
    }

    public LoadModel(url: string, location: number, rotation: number = 0, moveType: MoveType = MoveType.X) {
        // model
        const loader = new FBXLoader();
        loader.load(url, (object) => {

            if (moveType == MoveType.Z) {
                object.position.z -= 1600;
                object.position.x = location;
            }
            else {
                object.position.z -= 400 + location;
            }


            object.rotation.y += rotation * Math.PI;
            object.position.x -= this.modelX;
            object.position.y = this.groundY;
            const mixer = new THREE.AnimationMixer(object);

            const model: RunModel = {model: object, mixer, moveType} as RunModel;

            this.models.push(model);

            const action = mixer.clipAction(object.animations[0]);
            action.play();
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.scene.add(object);
        });
    }

    private Init(fov: number, aspect: number, near: number, far: number) {

        // 正投影相机THREE.OrthographicCamera（远近比例相同）和透视投影相机THREE.PerspectiveCamera(远处小近处大)
        // 透视角度越大物体越小
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, near, far )
        this.camera.position.set(60, 500, 1000);

        this.camera.lookAt({x: 0, y: 0, z: 0});

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene.fog = new THREE.Fog(this.scene.background, this.near, this.far);

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
        ground.position.y = this.groundY;
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
        // @ts-ignore
        this.stats = new Stats();
        this.element.appendChild(this.stats.dom);

        window.addEventListener('resize', this.onWindowResize, false);

        // control
        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = false;

        const controls = new OrbitControls(this.camera);

        controls.damping = 0.2;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 1;
        controls.minDistance = near;
        controls.maxDistance = far;

        // controls.minAzimuthAngle = 80 * Math.PI / 180; // radians
        //controls.maxAzimuthAngle =  -230 * Math.PI / 180; // radians
        controls.target = new THREE.Vector3(0, 0, 0);

        this.houseInit();
    }

    private houseInit() {

        let matArray: any[] = new Array<any>();
        // 右 左
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCD6839})); // 右
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCD6839})); // 左
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));


        let middleArray: any[] = new Array<any>();
        // 右 左
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF})); // 右
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF})); // 左
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));


        //左面墙
        this.WallGenerate(20, 500, 1800, -(this.modelX + 100), -300, -1100, matArray);
        this.WallGenerate(20, 500, 2000, -(this.modelX - 900), -300, -2000, middleArray, 0.5);
        this.WallGenerate(20, 500, 1800, -(this.modelX - 1900), -300, -1100, matArray);

    }

    private WallGenerate(width: number, height: number, depth: number, x: number, y: number, z: number, matArray: any[], rotation: number = 0) {
        const geometry = new THREE.BoxGeometry(width, height, depth);


        // const material = new THREE.MeshBasicMaterial({color: 0xC5C1AA});
        const cube = new THREE.Mesh(geometry, matArray);

        cube.receiveShadow = true;
        cube.position.x = x;
        cube.position.z = z;
        cube.position.y = y;
        cube.rotation.y += rotation * Math.PI;
        this.scene.add(cube);

    }

    private onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.render();

    };

    private render = () => {
        const delta = this.clock.getDelta();

        if (this.models) {
            for (const model of this.models) {
                model.mixer.update(delta);

                switch (model.moveType) {
                    case MoveType.X:
                        model.model.position.x += 1;
                        break;
                    case MoveType.Y:
                        model.model.position.y += 1;
                        break;
                    case MoveType.Z:
                        model.model.position.z += 1;
                        break;
                }


            }
        }
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };


}


