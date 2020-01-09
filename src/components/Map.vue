<template>
    <div style="height:1080px;width:3840px;text-align:left;">
        <div id="basicMapbox" style="height:1080px;width:100%;"></div>
        <pre id='info'></pre>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'
    import * as Three from 'three'
    import GLTFLoader from 'three-gltf-loader';

    export default {
        name: 'Map',
        data() {
            return {

            }
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                mapboxgl.accessToken = 'pk.eyJ1IjoiMTUyODM1NTg0MTF6eXMiLCJhIjoiY2swNjI5c3U5M3dxbjNicW90aWRtNm1nNSJ9.zHpouWxU37FW1h7zzs8vpg';
                var map = (window.map = new mapboxgl.Map({
                    container: 'basicMapbox',
                    style: 'mapbox://styles/mapbox/light-v10',
                    bearing: 12.80000000000018,
                    center: [104.074,30.650],
                    pitch: 36.99999999999998,
                    zoom: 11.83136771468713,
                    antialias: true //使用MSAA抗锯齿创建gl上下文，以便对自定义层进行抗锯齿
                }));

                //确保模型在地图上正确地理参考的参数
                var modelOrigin = [104.074,30.650];
                var modelAltitude = 0;
                var modelRotate = [Math.PI / 2, 0, 0];

                var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                    modelOrigin,
                    modelAltitude
                );

                //将参数转换为在地图上定位、旋转和缩放三维模型
                var modelTransform = {
                    translateX: modelAsMercatorCoordinate.x,
                    translateY: modelAsMercatorCoordinate.y,
                    translateZ: modelAsMercatorCoordinate.z,
                    rotateX: modelRotate[0],
                    rotateY: modelRotate[1],
                    rotateZ: modelRotate[2],
                    /* Since our 3D model is in real world meters, a scale transform needs to be
                     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
                     */
                    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
                };

                // 根据CustomLayerInterface为三维模型配置自定义层
                var customLayer = {
                    id: '3d-model',
                    type: 'custom',
                    renderingMode: '3d',
                    onAdd: function(map, gl) {
                        this.camera = new Three.Camera();
                        this.scene = new Three.Scene();

                        //创建两个Three.js灯光来照亮模型
                        var directionalLight = new Three.DirectionalLight(0xffffff);
                        directionalLight.position.set(0, -70, 100).normalize();
                        this.scene.add(directionalLight);

                        var directionalLight2 = new Three.DirectionalLight(0xffffff);
                        directionalLight2.position.set(0, 70, 100).normalize();
                        this.scene.add(directionalLight2);
                        //使用Three.js GLTF加载程序将三维模型添加到Three.js场景中
                        const loader = new GLTFLoader();
                        loader.load(
                            'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
                            // "@/assets/model/output/first.gltf",
                            function(gltf) {
                                this.scene.add(gltf.scene);
                            }.bind(this)
                        );
                        this.map = map;

                        //Three.js使用Mapbox GL JS地图画布
                        this.renderer = new Three.WebGLRenderer({
                            canvas: map.getCanvas(),
                            context: gl,
                            antialias: true,
                            alpha:true
                        });
                        //轴线
                        // this.scene.add(
                        //     new Three.AxesHelper(1000)
                        // )

                        this.renderer.autoClear = false;
                    },
                    render: function(gl, matrix) {
                        var rotationX = new Three.Matrix4().makeRotationAxis(
                            new Three.Vector3(1, 0, 0),
                            modelTransform.rotateX
                        );
                        var rotationY = new Three.Matrix4().makeRotationAxis(
                            new Three.Vector3(0, 1, 0),
                            modelTransform.rotateY
                        );
                        var rotationZ = new Three.Matrix4().makeRotationAxis(
                            new Three.Vector3(0, 0, 1),
                            modelTransform.rotateZ
                        );

                        var m = new Three.Matrix4().fromArray(matrix);
                        var l = new Three.Matrix4()
                            .makeTranslation(
                                modelTransform.translateX,
                                modelTransform.translateY,
                                modelTransform.translateZ
                            )
                            .scale(
                                new Three.Vector3(
                                    modelTransform.scale*100,
                                    -modelTransform.scale*100,
                                    modelTransform.scale*100
                                )
                            )
                            .multiply(rotationX)
                            .multiply(rotationY)
                            .multiply(rotationZ);

                        this.camera.projectionMatrix = m.multiply(l);
                        this.renderer.state.reset();
                        this.renderer.render(this.scene,this.camera);
                        this.map.triggerRepaint();
                    }
                };

                map.on('style.load', function() {
                    map.addLayer(customLayer, 'waterway-label');
                });

                window.map = map;
                window.mapboxgl = mapboxgl;
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');

    .coordinates {
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 5px 10px;
        margin: 0;
        font-size: 11px;
        line-height: 18px;
        border-radius: 3px;
        display: none;
    }
    #canvas{
        position:absolute;top:0;left:0;pointer-events: none;
    }

    #container {
        height: 400px;
    }

    .container {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: -1;
    }
</style>
