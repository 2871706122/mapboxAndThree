<template>
    <div style="height:1080px;width:1920px;text-align:left;" class="mapBox">
        <div id="basicMapbox"></div>
    </div>
</template>

<script>
    import mapboxgl from 'mapbox-gl'
    import * as THREE from 'three'
    import OrbitControls from 'three/examples/js/controls/OrbitControls'
    import GLTFLoader from 'three-gltf-loader';

    export default {
        name: 'Map',
        data() {
            return {
                map:null,
                modelAsMercatorCoordinate:"",
                modelTransform:"",
                matrix:"",
                camera:"",
                renderer:"",
                scene:"",
                flag:true,
                init3scene:"",
                init3camera:"",
                init3renderer:"",
            }
        },
        mounted() {
            this.init2();
            this.init3();
            this.init();
            //this.init3();
        },
        methods: {
            // 初始化
            init() {
                if(this.map){
                    return
                }
                mapboxgl.accessToken = 'pk.eyJ1IjoiMTUyODM1NTg0MTF6eXMiLCJhIjoiY2swNjI5c3U5M3dxbjNicW90aWRtNm1nNSJ9.zHpouWxU37FW1h7zzs8vpg';
                this.map = (window.map = new mapboxgl.Map({
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

                this.modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                    modelOrigin,
                    modelAltitude
                );

                //将参数转换为在地图上定位、旋转和缩放三维模型
                this.modelTransform = {
                    translateX: this.modelAsMercatorCoordinate.x,
                    translateY: this.modelAsMercatorCoordinate.y,
                    translateZ: this.modelAsMercatorCoordinate.z,
                    rotateX: modelRotate[0],
                    rotateY: modelRotate[1],
                    rotateZ: modelRotate[2],
                    /* Since our 3D model is in real world meters, a scale transform needs to be
                     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
                     */
                    scale: this.modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
                };

                let that = this;
                // 根据CustomLayerInterface为三维模型配置自定义层
                var customLayer = {
                    id: '3d-model',
                    type: 'custom',
                    renderingMode: '3d',
                    onAdd: function(map, gl) {
                        this.camera = that.init3camera
                        this.scene = that.init3scene

                        //创建两个Three.js灯光来照亮模型
                        var directionalLight = new THREE.DirectionalLight(0xffffff);
                        directionalLight.position.set(0, -70, 100).normalize();
                        this.scene.add(directionalLight);

                        var directionalLight2 = new THREE.DirectionalLight(0xffffff);
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
                        this.renderer = new THREE.WebGLRenderer({
                            canvas: map.getCanvas(),
                            context: gl,
                            antialias: true,
                            alpha:true
                        });

                        this.renderer.autoClear = false;
                    },
                    render: function(gl,matrix) {
                        this.matrix=matrix;
                        var rotationX = new THREE.Matrix4().makeRotationAxis(
                            new THREE.Vector3(1, 0, 0),
                            that.modelTransform.rotateX
                        );
                        var rotationY = new THREE.Matrix4().makeRotationAxis(
                            new THREE.Vector3(0, 1, 0),
                            that.modelTransform.rotateY
                        );
                        var rotationZ = new THREE.Matrix4().makeRotationAxis(
                            new THREE.Vector3(0, 0, 1),
                            that.modelTransform.rotateZ
                        );

                        var m1 = new THREE.Matrix4().fromArray(matrix);
                        var m2 = new THREE.Matrix4().makeTranslation(that.modelTransform.translateX,that.modelTransform.translateY,that.modelTransform.translateZ)
                            .scale( new THREE.Vector3(that.modelTransform.scale*100,-that.modelTransform.scale*100,that.modelTransform.scale*100))
                            .multiply(rotationX)
                            .multiply(rotationY)
                            .multiply(rotationZ);
                        let mat =  m1.multiply(m2);//注意，这个值一定要在这里保存起来，在下面使用mat这个变量，下面两个使用mat值的地方不能改为m1.multiply(m2)，改为这个会报错
                        this.camera.projectionMatrix =mat;
                        //that.zuoBiao = JSON.parse(JSON.stringify(m1.multiply(m2)));
                        this.scene.add(that.scene);
                        this.renderer.state.reset();
                        this.renderer.render(this.scene,this.camera);
                        this.map.triggerRepaint();
                    }
                };

                this.map.on('style.load', ()=>{
                    this.map.addLayer(customLayer, 'waterway-label');
                });

                window.map = map;
                window.mapboxgl = mapboxgl;
            },
            //创建一个正方体，在渲染信号塔的时候把正方体加在信号塔模型上面，作为一个整体，最后作为一个图层加入地图
            init2(){
                this.scene = new THREE.Scene();
                var geometry = new THREE.BoxGeometry( 10, 10, 10 );
                var material = new THREE.MeshBasicMaterial({color: "rgb(45,45,45)"});
                var cube = new THREE.Mesh( geometry, material );
                cube.position.set(0,0,30);
                this.scene.add( cube );
            },
            init3(){
                this.init3scene = new THREE.Scene();
                // var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
                var geometry = new THREE.BoxGeometry(10, 10, 10); //创建一个立方体几何对象Geometry
                var material = new THREE.MeshLambertMaterial({
                    color: 0x0000ff
                }); //材质对象Material
                var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
                mesh.position.set(30,0,0)
                this.init3scene.add(mesh); //网格模型添加到场景中
                console.log(mesh)
                let axes = new THREE.AxesHelper(10000)
                this.init3scene.add(axes)
                /**
                 * 光源设置
                 */
                //     //点光源
                // var point = new THREE.PointLight(0xffffff);
                // point.position.set(400, 200, 300); //点光源位置
                // this.init3scene.add(point); //点光源添加到场景中
                //环境光
                // var ambient = new THREE.AmbientLight(0xffffff,1);
                // this.init3scene.add(ambient);
                /**
                 * 相机设置
                 */
                var width = window.innerWidth; //窗口宽度
                var height = window.innerHeight; //窗口高度
                //创建相机对象
                this.init3camera = new THREE.Camera();
                /**
                 * 创建渲染器对象
                 */
                this.init3renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
                this.init3renderer.setSize(width,height);//设置渲染区域尺寸
                // renderer.setClearColor('rgba(0,0,0,0)',1); //设置背景颜色
                this.init3renderer.domElement.style.pointerEvents='none'
                this.init3renderer.domElement.style.position = 'absolute'
                this.init3renderer.domElement.style.top = 0
                this.init3renderer.domElement.style.left = 0
                this.init3renderer.domElement.style.zIndex = -2
                document.getElementsByClassName("mapBox")[0].appendChild(this.init3renderer.domElement); //body元素中插入canvas对象
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');

    #basicMapbox {
        position: absolute;
        top: 0px;
        left: 0px;
        height:1080px;
        width:100%;
        z-index: -2;
    }

</style>