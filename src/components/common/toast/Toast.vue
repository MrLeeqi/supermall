<template lang="">
  <div class="toast" v-show='isShow'>
    <div>{{message}}</div>
  </div>
</template>
<script>
  export default {
    name: 'Toast',
    // props: {
    //   message: {
    //     type: String,
    //     default: ''
    //   },
    //   show: {
    //     type: Boolean,
    //     default: false
    //   }
    // }
    data() {
      return {
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message='默认文字', duration=2000) {
        // ES5给默认值的写法：duration = duration || 2000
        this.isShow = true
        this.message = message

        setTimeout(() => {
          this.isShow = false
          this.message = ''
        }, duration);
      }
    },
  }
</script>
<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;    /* 这两个属性还不至于将div垂直水平居中 */
    transform: translate(-50%, -50%);   /* 加上这个就可以使原本没在正中间的div垂直水平居中了 */
    padding: 8px 10px;
    border-radius: 5px;

    z-index: 999;

    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>