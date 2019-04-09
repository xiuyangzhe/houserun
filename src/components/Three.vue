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
        },
    };
</script>

<style scoped>
</style>
