<template lang="">
  <div id="home">
    <nav-bar class="home-nav"><template v-slot:center>购物街</template></nav-bar>
    <tab-control :titles='["流行", "新款", "精选"]' @tabClick='tabClick' ref="tabControl1" class="tab-control-2" v-show='isTabFixed'/>
    <scroll class="content" ref="scroll" :probe-type='3' @scroll='contentScroll' :pull-up-load='true' @pullingUp='loadMore'>
      <home-swiper :banners='banners' @swiperImageLoad='swiperImageLoad'/>
      <recommend-view :recommends='recommends'/>
      <feature-view/>
      <tab-control class="tab-control" :titles='["流行", "新款", "精选"]' @tabClick='tabClick' ref="tabControl2"/>
      <!-- <tab-control class="tab-control" :titles='["流行", "新款", "精选"]' @tabClick='tabClick' ref="tabControl" :class='{fixed: isTabFixed}'/> -->
      <goods-list :goods='showGoods'/>
    </scroll>
    <back-top @click.native='backTop' v-show='isShowBackTop'/>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  import {NEW, POP, SELL} from "@/common/const";

  export default {
    name: 'Home',
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      HomeSwiper,
      RecommendView,
      FeatureView
    },
		mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: POP,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    unmounted() {
      console.log('销毁时调用，Vue2.X用的是destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存跳转时的Y值，作用是下次跳转回来时还在离开时的位置
      this.saveY = this.$refs.scroll.getScrollY()

      // 取消全局事件的监听
      this.$bus.off('itemImageLoad', this.itemImageListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods(POP)
      this.getHomeGoods(NEW)
      this.getHomeGoods(SELL)

    },
    // mounted() {
    //   // 3.监听GoodsListItem中的图片是否加载完成，如果加载完成，则调用better-scroll中的refresh更新滚动的高度
    //   // this.$bus.on('itemImageLoad', () => {
    //   //   // 加this.$refs.scroll && 的目的是防止scroll组件还没挂载完，就已经执行this.$refs.scroll.refresh()了，这样会报错
    //   //   this.$refs.scroll && this.$refs.scroll.refresh()  // 意思是如果this.$refs.scroll不是null或者undefined，才执行 && 后面的代码
    //   // })
    //   // 上面的refresh执行得太频繁了，使用防抖函数提升性能
    //   const refresh = debounce(this.$refs.scroll.refresh, 50)
    //   // 对监听的事件进行保存
    //   this.itemImageListener = () => {
    //     refresh()
    //   }
    //   this.$bus.on('itemImageLoad', this.itemImageListener)
    // },
    methods: {
      // 事件监听相关的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position) {
        // 1. 判断backTop是否显示
        this.listenshowBackTop(position)
        // 2. 决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        // 等swiper图片加载完后，获取tabControl的offsetTop才是正确的值
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      // 网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res)
          this.goods[type].page += 1

          // 完成初次上拉加载更多时，scroll插件需要调用以下方法才能继续上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    },
  }
</script>
<style scoped>
  /* 对应下面的方法一 */
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  /* 对应下面的方法二 */
  /* #home {
    height: 100vh;
    position: relative;
  } */
  
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 在使用浏览器原生滚动时，为了让导航不跟随滚动时使用 */
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9; */
  }

  .tab-control-2 {
    position: relative;
    z-index: 9;
  }

  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  /* 这里对中间区域滑动高度的处理有两种 */
  /* 方法一 */
  .content {
    /* height: 500px; */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /* 这个方法在使用了BScroll之后，固定tabControl不管用 */
  /* .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  } */

  /* 方法二 */
  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>