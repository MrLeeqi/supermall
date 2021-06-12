<template lang="">
  <div class="goods-item" @click='itemClick'>
    <img :src="goodsItem.img" alt="" @load='imgLoad'>
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    imgLoad() {
      this.$bus.emit('itemImageLoad')
      // 处理首页和详情页中同时使用该事件刷新scroll的高度问题，如果没有这段代码，
      // 则当我们跳转到详情页时加载GoodsListItem，给首页也发出了这个事件，这个是没必要的，所以要有这段代码
      // if (this.$route.path.indexOf('/home')) {
      //   this.$bus.emit('homeItemImageLoad')
      // }
      // else if (this.$route.path.indexOf('/detail')) {
      //   this.$bus.emit('detailItemImageLoad')
      // }
    },
    itemClick() {
      this.$router.push('/detail/' + this.goodsItem.tradeItemId)
    }
  },
}
</script>
<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>