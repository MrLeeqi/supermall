import { debounce } from 'common/utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 50)
    // 对监听的事件进行保存
    this.itemImageListener = () => {
      this.refresh()
    }
    this.$bus.on('itemImageLoad', this.itemImageListener)
  },
}