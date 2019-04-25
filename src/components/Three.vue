<template>
    <div id="container"></div>
</template>
<script lang="ts">
import Light, {MoveType} from '../three/HemisphereLight';
import * as THREE from 'three';

export default {
    name: 'Three',
    methods: {},
    mounted: () => {
        const container = document.getElementById('container');
        const hemisphereLight = new Light(container);
        //hemisphereLight.LoadModelDEA('../models/Treadmill Running.dae', 100, 0.5, MoveType.X,1000,'default','Beta_Surface'); //mesh Beta_Surface Beta_Joints
        //hemisphereLight.LoadModelGltf('../models/Soldier.glb', 100, -0.5, MoveType.X, 100, 'Run', 'vanguard_Mesh');
        // hemisphereLight.LoadModelFBXMulti('../models/Treadmill Running.fbx', 100, 0.5,MoveType.X,20);
        // for (let i = 0; i < 5; i++) {
        //     hemisphereLight.LoadModel('../models/Treadmill Running.fbx', i * 100, 0, MoveType.Z);
        // }
    },
};
</script>

<style scoped>
</style>
