<template>
    <div>
        <Title></Title>
        <canvas id="canvas1" width="200" height="200"></canvas>
    </div>
</template>

<script>
    import Title from "./common/Title.vue"

    export default {
        name: "page2",
        mounted() {
            this.$nextTick(() => {
                this.mapTo();
                this.mapThings();
                this.makecanvas1();
            })
        },
        methods: {
            makecanvas1(){
                var canvas1 = document.getElementById("canvas1");//获取canvas标签  也是绘图区域
                var pen = canvas1.getContext("2d");//得到一支2d画笔
                pen.fillStyle="rgba(0,0,255,1)";//填充色
                pen.fillRect(0,0,200,200);//绘制区域 开始x，开始y，长度，宽度

            },
            mapTo() {
                var obj = {
                    bearing: 12.80000000000018,
                    center: {lng: 104.09722336546542, lat: 30.660263514050357},
                    pitch: 5.999999999999975,
                    zoom: 15.448330386419102
                }
                window.map.flyTo(obj)
            },
            mapThings() {
                window.map.on('click', this.mapClick)
            },
            remove_mapThing() {
                window.map.off('click', this.mapClick)
            },
            mapClick(e) {
                console.log("page2")
                var obj = {
                    zoom: window.map.getZoom(),
                    bearing: window.map.getBearing(),
                    center: window.map.getCenter(),
                    pitch: window.map.getPitch()
                }
                console.log(obj)
            }
        },
        components: {
            Title
        },
        beforeDestroy() {
            this.remove_mapThing();
        }
    }
</script>

<style scoped>

</style>
