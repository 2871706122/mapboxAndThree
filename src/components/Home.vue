<template>
    <div>
      <Title></Title>
    </div>
</template>

<script>
  import Title from "./common/Title.vue"
  import myNameIsPoint from "../marker/myNameIsPoint.vue"
    export default {
      name: "Homg",
      data(){
        return {
          marker:[]
        }
      },
      components:{
        myNameIsPoint
      },
      mounted(){
        this.$nextTick(()=>{
          this.mapTo();
          this.mapThings();
          this.addMarker();
        })
      },
      methods:{
        mapTo(){
          var obj = {
            bearing: 12.80000000000018,
            center:{lng: 104.0740119354358, lat: 30.65000286122246},
            pitch: 36.99999999999998,
            zoom: 11.83136771468713
          }
          window.map.flyTo(obj)
        },
        mapThings(){
          window.map.on('click',this.mapClick)
        },
        remove_mapThing(){
          window.map.off('click',this.mapClick)
        },
        mapClick(e){
          console.log("home")
          //console.log(e)
          var obj = {
            zoom:window.map.getZoom(),
            bearing:window.map.getBearing(),
            center:window.map.getCenter(),
            pitch:window.map.getPitch()
          }
          //console.log(obj)
          console.log(JSON.stringify(e.lngLat.toArray()));
        },
        addMarker(){
          var _this = this;
          var arr = [
            [104.00524984084575,30.629862130678603],
            [103.95375923292693,30.69305408758504],
            [104.05539650250842,30.661885663568356]
          ]
          for(let i=0;i<arr.length;i++){
            var div = document.createElement("div");
            div.className="point";
            div.innerText="point";
            var marker = new window.mapboxgl.Marker(div).setLngLat(arr[i]).addTo(window.map)
            this.marker.push(marker)
          }
        }
      },
      components:{
        Title
      },
      beforeDestroy(){
        this.remove_mapThing();
        var marker = this.marker;
        for(var i=0;i<marker.length;i++){
          marker[i].remove();
        }
      }
    }
</script>

<style scoped>

</style>
