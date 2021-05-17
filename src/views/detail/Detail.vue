<template lang="">
  <div>
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper :top-images='topImages'></detail-swiper>
    <detail-base-info :goods='goods'></detail-base-info>
  </div>
</template>
<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'

  import {getDetail, Goods} from 'network/detail'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {}
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据传入的iid请求详情页的数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        const data = res.data.result
        // 1.获取顶部的轮播图片
        this.topImages = data.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.priceInfo, data.itemServices)
      })
    },
  }
</script>
<style lang="css" scoped>

</style>