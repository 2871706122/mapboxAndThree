<template>
  <div>
    <span :class="[a1?'checked':'']" @click="change(0)">home</span>
    <span :class="[a2?'checked':'']" @click="change(1)">page2</span>
    <span :class="[a3?'checked':'']" @click="change(2)">page3</span>
  </div>
</template>

<script>
    export default {
      name: "Title",
      data(){
        return {
          a1:false,
          a2:false,
          a3:false
        }
      },
      computed:{

      },
      mounted(){
        this.init();
      },
      watch:{

      },
      methods:{
        change(index){
          switch (index) {
            case 0:{
              this.$router.push("/home")
              break;
            }
            case 1:{
              this.$router.push("/page2")
              break;
            }
            case 2:{
              this.$router.push("/page3")
              break;
            }
          }
        },
        init(){
          var val = window.location.href;
          var num1 = val.indexOf("home");
          var num2 = val.indexOf("page2");
          var num3 = val.indexOf("page3");
          if(num1>-1){
            this.a1=true
            this.a2=false
            this.a3=false
          }else if(num2>-1){
            this.a2=true
            this.a1=false
            this.a3=false
          }else if(num3>-1){
            this.a3=true
            this.a2=false
            this.a1=false
          }
        }
      }
    }
</script>

<style scoped>
  div  {
    padding-top: 20px;
  }
  span {
    margin-left: 20px;
    padding: 10px 20px;
    border: 1px solid rgba(255,255,255,0.5);
    cursor: pointer;
  }

  .checked {
    background-color: rgba(0,255,255,0.2);
  }
</style>
