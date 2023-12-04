<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
// import screenfull from 'screenfull'
export default {
  data() {
    return {
      isFull: false
    }
  },
  methods: {
    /*     changeScreen() {
      if (screenfull.isEnabled) {
        return screenfull.toggle()
      }
      this.$message.warning('全局组件不可使用')
    } */
    // 使用原生js
    changeScreen() {
      this.isFull = !this.isFull
      if (this.isFull === true) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }
}
</script>

<style>

</style>
