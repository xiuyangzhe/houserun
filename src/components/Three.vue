<template>
    <div id="container">Three</div>
</template>
<script lang="ts">
import Light from '../three/HemisphereLight';

export default {
    name: 'Three',
    methods: {},
    mounted: () => {
        const container = document.getElementById('container');
        const hemisphereLight = new Light(container);
        for (let i = 0; i < 20; i++) {
            hemisphereLight.LoadModel('../models/Samba Dancing.fbx', i * 100);
        }
    },
};
</script>

<style scoped>
</style>
