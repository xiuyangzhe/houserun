/// <refrence path="plugin/Types.d.ts">;

import * as THREE from 'three';
import FBXLoader from 'three-fbxloader-offical';
import GLTFLoader from 'three-gltf-loader';
import ColladaLoader from '../plugin/Loaders/ColladaLoader';
import OrbitControls from 'three-orbitcontrols';
import enumerate = Reflect.enumerate;

interface RunModel {
    mixer: any;
    model: any;
    moveType: MoveType;

}

export enum MoveType {
    X,
    Y,
    Z,
}

export default class HemisphereLight {

    private fov: number = 90;
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
    private readonly models: RunModel[];
    private modelX: number = 1000;
    private groundY: number = -500;

    // private personPre: any;
    // private personChild: any;
    // private mixers: any;

    constructor(element: any) {
        this.models = new Array<RunModel>();
        this.element = element;
        this.Init(this.fov, this.aspect, this.near, this.far);

        this.clock = new THREE.Clock();
        this.animate();
    }

    public LoadModelFBXMulti(url: string, location: number, rotation: number = 0, moveType: MoveType = MoveType.X, count: number) {
        // model
        const loader = new FBXLoader();

        loader.load(url, (object) => {

            const personChild = object.children[1];
            if (moveType === MoveType.Z) {
                object.position.z -= 1600;
                object.position.x = location;
            } else {
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


            for (let i = 1; i < count; i++) {

                const newobj = JSON.parse(JSON.stringify(object));
                if (moveType === MoveType.Z) {
                    newobj.position.x = location * i;
                } else {
                    newobj.position.z -= 400 + location * i;
                }
                this.scene.add(newobj);
            }

        });


    }

    public LoadModelFBX(url: string, location: number, rotation: number = 0, moveType: MoveType = MoveType.X) {
        // model
        const loader = new FBXLoader();
        loader.load(url, (object) => {
            if (moveType === MoveType.Z) {
                object.position.z -= 1600;
                object.position.x = location;
            } else {
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

    public LoadModelDEA(url: string, location: number, rotation: number = 0, moveType: MoveType = MoveType.X) {
        // model
        const loader = new ColladaLoader();
        loader.load(url, (deaobj) => {
            const object = deaobj.scene;
            const animations = deaobj.animations;
            const mixer = new THREE.AnimationMixer(object);
            const action = mixer.clipAction(animations[0]).play();
            if (moveType === MoveType.Z) {
                object.position.z -= 1600;
                object.position.x = location;
            } else {
                object.position.z -= 400 + location;
            }

            object.rotation.y += rotation * Math.PI;
            object.position.x -= this.modelX;
            object.position.y = this.groundY;

            deaobj.scene.traverse((child) => {
                if (child.isSkinnedMesh) {
                    child.frustumCulled = false;
                }
            });
            const model: RunModel = {model: deaobj.scene, mixer, moveType} as RunModel;
            this.models.push(model);

            this.scene.add(object);
        });
    }

    public LoadModelGltf(url: string, location: number, rotation: number = 0, moveType: MoveType = MoveType.X, count: number, actionname: string, meshName: string) {
        // model
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => {
                // called when the resource is loaded

                for (let i = 0; i < count; i++) {
                    const object = SkeletonUtils.clone(gltf.scene);

                    if (moveType === MoveType.Z) {
                        object.position.z -= 1600;
                        object.position.x = location * i;
                    } else {
                        object.position.z -= 100 + location * i;
                    }
                    object.rotation.y += rotation * Math.PI;
                    object.position.x -= this.modelX;
                    object.position.y = this.groundY;
                    object.scale.set(100, 100, 100);

                    if (object) {
                        const clonedMesh = object .getObjectByName(meshName);
                        const mixer = this.startAnimation(clonedMesh, gltf.animations, actionname);
                        if (mixer) {
                            const model: RunModel = {model: object, mixer, moveType} as RunModel;
                            // Save the animation mixer in the list, will need it in the animation loop
                            this.models.push(model);
                        }
                    }
                    this.scene.add(object);
                }
            },
            (xhr) => {
                // called while loading is progressing
                console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                // called when loading has errors
                console.error('An error happened', error);
            },
        );

        // loader.load(url, (object) => {
        //     if (moveType === MoveType.Z) {
        //         object.position.z -= 1600;
        //         object.position.x = location;
        //     } else {
        //         object.position.z -= 400 + location;
        //     }
        //
        //
        //     object.rotation.y += rotation * Math.PI;
        //     object.position.x -= this.modelX;
        //     object.position.y = this.groundY;
        //     const mixer = new THREE.AnimationMixer(object);
        //
        //     const model: RunModel = {model: object, mixer, moveType} as RunModel;
        //
        //     this.models.push(model);
        //
        //
        //
        //     var material = new THREE.MeshLambertMaterial({color:0xCD6839});
        //     object.traverse((child) => {
        //         child.geometry  = new THREE.Geometry();
        //         if (child.isMesh) {
        //             child.material = material;
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //         }
        //     });
        //
        //     const action = mixer.clipAction(object.animations[0]);
        //     action.play();
        //
        //     this.scene.add(object);
        // });
    }

    /**
     * Start animation for a specific mesh object. Find the animation by name in the 3D model's animation array
     * @param skinnedMesh {THREE.SkinnedMesh} The mesh to animate
     * @param animations {Array} Array containing all the animations for this model
     * @param animationName {string} Name of the animation to launch
     * @return {THREE.AnimationMixer} Mixer to be used in the render loop
     */
    private startAnimation(skinnedMesh, animations, animationName) {
        const mixer = new THREE.AnimationMixer(skinnedMesh);
        const clip = THREE.AnimationClip.findByName(animations, animationName);
        if (clip) {
            const action = mixer.clipAction(clip);
            action.play();
        }
        return mixer;
    }

    private Init(fov: number, aspect: number, near: number, far: number) {

        // 正投影相机THREE.OrthographicCamera（远近比例相同）和透视投影相机THREE.PerspectiveCamera(远处小近处大)
        // 透视角度越大物体越小
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,
        // window.innerHeight / 2, window.innerHeight / - 2, near, far )
        this.camera.position.set(60, 500, 1000);

        this.camera.lookAt({x: 0, y: 0, z: 0});

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xF0F8FF);
        this.scene.fog = new THREE.Fog(this.scene.background, this.near, this.far);

        // LIGHTS
        this.hemiLight = new THREE.HemisphereLight(0x00BFFF, 0xffffff, 0.6);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        // this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, -50, -10000);
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
        // controls.maxAzimuthAngle =  -230 * Math.PI / 180; // radians
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.enablePan = true;

        // window.addEventListener('mousewheel', this.onMouseWheel,false);
        // window.addEventListener('mousewheel', (e) => {
        // }, {passive: false});
        // window.addEventListener('wheel', (e) => {
        // }, {passive: false});

        this.houseInit();
    }

    private houseInit() {

        const matArray: any[] = new Array<any>();
        // 右 左
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCD6839})); // 右
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCD6839})); // 左
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        matArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));


        const middleArray: any[] = new Array<any>();
        // 右 左
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF})); // 右
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF})); // 左
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));
        middleArray.push(new THREE.MeshBasicMaterial({color: 0xCDC5BF}));


        // 左面墙
        this.WallGenerate(20, 500, 3800, -(this.modelX + 100), -300, -1100, matArray);
        this.WallGenerate(20, 500, 2000, -(this.modelX - 900), -300, -3000, middleArray, 0.5);
        this.WallGenerate(20, 500, 3800, -(this.modelX - 1900), -300, -1100, matArray);

    }

    private WallGenerate(width: number, height: number, depth: number, x: number, y: number, z: number,
                         matArray: any[], rotation: number = 0) {
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
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
    }

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
    }
}


