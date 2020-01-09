<template>
  <div>
    <Title></Title>
  </div>
</template>

<script>
  import Title from "./common/Title.vue"
  export default {
    name: "page3",
    mounted(){
      this.$nextTick(()=>{
        this.mapTo();
        this.mapThings();
      })
    },
    methods:{
      mapTo(){
        var obj = {
          bearing: 12.80000000000018,
          center:{lng: 104.01714539532372, lat: 30.669462877522406},
          pitch: 5.999999999999975,
          zoom: 16.205391326759873
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
        console.log("page3")
        var obj = {
          zoom:window.map.getZoom(),
          bearing:window.map.getBearing(),
          center:window.map.getCenter(),
          pitch:window.map.getPitch()
        }
        console.log(obj)
      }
    },
    components:{
      Title
    },
    beforeDestroy(){
      this.remove_mapThing();
    }
  }
</script>

<style scoped>

</style>
