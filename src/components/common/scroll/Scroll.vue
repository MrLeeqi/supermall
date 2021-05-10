<template lang="">
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1. 创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2. 监听滚动的位置
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      })

      // console.log(this.scroll);
    },
    methods: {
      scrollTo(x, y, time=500) {
        this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        // 加this.scroll && 的目的是防止scroll组件还没挂载完，就已经执行this.scroll.refresh()了，这样会报错
        this.scroll && this.scroll.refresh()  // 意思是如果this.scroll不是null或者undefined，才执行 && 后面的代码
      }
    },
  }
</script>
<style lang="" scoped>

</style>