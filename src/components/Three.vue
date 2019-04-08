<template>
    <div>Three</div>
</template>
<script lang="ts">
    import Run from '../three/Run';

    export default {
        name: 'Three',
    };

    const ShowRun = new Run();
    ShowRun.LoadModel('../models/Running.json');
</script>

<style scoped>

</style>
