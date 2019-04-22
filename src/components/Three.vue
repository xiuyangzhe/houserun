<template>
    <div id="container">Three</div>
</template>
<script lang="ts">
    import Light, {MoveType} from '../three/HemisphereLight';

    export default {
        name: 'Three',
        methods: {},
        mounted: () => {
            const container = document.getElementById('container');
            const hemisphereLight = new Light(container);
            for (let i = 0; i < 5; i++) {
                hemisphereLight.LoadModel('../models/Treadmill Running.fbx', i * 100, 0.5);
            }
            for (let i = 0; i < 5; i++) {
                hemisphereLight.LoadModel('../models/Treadmill Running.fbx', i * 100, 0, MoveType.Z);
            }
        },
    };
</script>

<style scoped>
</style>
