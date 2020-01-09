<template>
    <div id="app">
        <router-view/>
        <Map class="map"></Map>
    </div>
</template>

<script>
    import Map from "./components/Map.vue"

    export default {
        name: 'App',
        components: {
            Map
        }
    }
</script>

<style>
    * {
        margin: 0px;
        padding: 0px;
        color: black;
        font-size: 24px;
    }

    #app {
        position: relative;
        top: 0px;
        left: 0px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0px;
        padding: 0px;
    }

    .map {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: -2;
    }
</style>
