import { debounce } from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'
import { BACKTOP_DISTANCE } from "@/common/const";

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

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenshowBackTop(position) {
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
    }
  },
}
