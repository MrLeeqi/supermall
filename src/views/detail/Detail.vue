<template lang="">
	<div id="detail">
		<detail-nav-bar class="detail-nav" @titleClick='titleClick' />
		<scroll class="content" ref="scroll">
			<detail-swiper :top-images='topImages'></detail-swiper>
			<detail-base-info :goods='goods'></detail-base-info>
			<detail-shop-info :shop='shop'></detail-shop-info>
			<detail-goods-info :detail-info='detailInfo' @imgLoad="imgLoad"></detail-goods-info>
			<detail-param-info ref="params" :param-info='paramInfo'></detail-param-info>
			<detail-comment-info ref="comment" :comment-info='commentInfo' />
			<goods-list ref="recommend" :goods='recommends'></goods-list>
		</scroll>
	</div>
</template>
<script>
	import DetailNavBar from './childComps/DetailNavBar'
	import DetailSwiper from './childComps/DetailSwiper'
	import DetailBaseInfo from './childComps/DetailBaseInfo'
	import DetailShopInfo from './childComps/DetailShopInfo'
	import DetailGoodsInfo from './childComps/DetailGoodsInfo'
	import DetailParamInfo from './childComps/DetailParamInfo'
	import DetailCommentInfo from './childComps/DetailCommentInfo'

	import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

	import {
		getDetail,
		getRecommend,
		Goods,
		Shop,
		GoodsParam
	} from 'network/detail'
  import {itemListenerMixin} from 'common/mixin'
  import {debounce} from 'common/utils'

	export default {
		name: 'Detail',
		components: {
			DetailNavBar,
			DetailSwiper,
			DetailBaseInfo,
			DetailShopInfo,
			DetailGoodsInfo,
			DetailParamInfo,
			DetailCommentInfo,
			Scroll,
			GoodsList
		},
		mixins: [itemListenerMixin],
		data() {
			return {
				iid: null,
				topImages: [],
				goods: {},
				shop: {},
				detailInfo: {},
				paramInfo: {},
				commentInfo: {},
				recommends: [],
				detailScrollYs: [],
				getDetailScrollYs: null
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

				// 3.获取店铺信息数据
				this.shop = new Shop(data.shopInfo)

				// 4.保存商品的详细信息
				this.detailInfo = data.detailInfo

				// 模拟一下数据
				const itemParamsData = data.itemParams
				itemParamsData['rule'] = {
					'tables': [
						[
							['尺码', 'M', 'L', 'XL', 'XXL'],
							['衣长', '61.5', '63', '64.5', '66'],
							['胸围', '98', '104', '110', '116'],
							['袖长', '63', '66', '68.5', '70.5']
						]
					]
				}
				// 5.获取商品参数信息
				this.paramInfo = new GoodsParam(itemParamsData.info, itemParamsData.rule)

				// 6.获取评论信息
				if (data.rateInfo.cRate !== 0) {
					this.commentInfo = data.rateInfo.list
				}

				// 第一次在此获取时，值是不对的
				// 因为 this.$refs.params.$el 压根没有渲染
				// this.detailScrollYs.push(0)
				// this.detailScrollYs.push(this.$refs.params.$el.offsetTop)
				// this.detailScrollYs.push(this.$refs.comment.$el.offsetTop)
				// this.detailScrollYs.push(this.$refs.recommend.$el.offsetTop)
				// console.log(this.detailScrollYs);

				// 第二次获取
				// 要想拿到【商品、参数、评论、推荐】渲染完之后的高度，必须等到所有视图加载完毕才能获取
				// 但是，图片依然是没有加载完，获取到的offsetTop不包含其中的图片
				// 等到整个视图渲染完毕后，就会回调一下这个函数（不包含图片在内哦）
				// 官方解说：https://cn.vuejs.org/v2/api/#updated
				// this.$nextTick(() => {
				// 	this.detailScrollYs.push(0)
				// 	this.detailScrollYs.push(this.$refs.params.$el.offsetTop)
				// 	this.detailScrollYs.push(this.$refs.comment.$el.offsetTop)
				// 	this.detailScrollYs.push(this.$refs.recommend.$el.offsetTop)
				// 	console.log(this.detailScrollYs);
				// })
			})
			
			// 3.获取详情页商品推荐数据
			getRecommend().then(res => {
				this.recommends = res
			})

			// 4.给getDetailScrollYs赋值，使其不要频繁的调用，达到防抖的效果
			this.getDetailScrollYs = debounce(() => {
				this.detailScrollYs.push(0)
				this.detailScrollYs.push(this.$refs.params.$el.offsetTop)
				this.detailScrollYs.push(this.$refs.comment.$el.offsetTop)
				this.detailScrollYs.push(this.$refs.recommend.$el.offsetTop)
				console.log(this.detailScrollYs);
			}, 100)
		},
		// mounted() {
    //   const refresh = debounce(this.$refs.scroll.refresh, 50)
    //   // 对监听的事件进行保存
    //   this.itemImageListener = () => {
    //     refresh()
    //   }
    //   this.$bus.on('itemImageLoad', this.itemImageListener)
		// },
		unmounted() {
      // 取消全局事件的监听
      this.$bus.off('itemImageLoad', this.itemImageListener)
		},
		methods: {
			imgLoad() {
				// this.$refs.scroll.refresh()
				// 这是混入(mixin.js)里面的refresh
				this.refresh()

				this.getDetailScrollYs()
				console.log('---------');
			},
			titleClick(index) {
				this.$refs.scroll.scrollTo(0, -this.detailScrollYs[index], 200)
			}
		},
	}
</script>
<style scoped>
	#detail {
		position: relative;
		z-index: 9;
		background-color: #fff;
		height: 100vh;
	}

	.detail-nav {
		position: relative;
		z-index: 9;
		background-color: #fff;
	}

	.content {
		height: calc(100% - 44px);
	}
</style>