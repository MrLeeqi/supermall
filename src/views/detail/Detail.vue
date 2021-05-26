<template lang="">
	<div id="detail">
		<detail-nav-bar class="detail-nav" />
		<scroll class="content" ref="scroll">
			<detail-swiper :top-images='topImages'></detail-swiper>
			<detail-base-info :goods='goods'></detail-base-info>
			<detail-shop-info :shop='shop'></detail-shop-info>
			<detail-goods-info :detail-info='detailInfo' @imgLoad="imgLoad"></detail-goods-info>
			<detail-param-info :param-info='paramInfo'></detail-param-info>
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

	import Scroll from 'components/common/scroll/Scroll'

	import {
		getDetail,
		Goods,
		Shop,
		GoodsParam
	} from 'network/detail'

	export default {
		name: 'Detail',
		components: {
			DetailNavBar,
			DetailSwiper,
			DetailBaseInfo,
			DetailShopInfo,
			DetailGoodsInfo,
			DetailParamInfo,
			Scroll
		},
		data() {
			return {
				iid: null,
				topImages: [],
				goods: {},
				shop: {},
				detailInfo: {},
				paramInfo: {}
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
				// 获取商品参数信息
				this.paramInfo = new GoodsParam(itemParamsData.info, itemParamsData.rule)
			})
		},
		methods: {
			imgLoad() {
				this.$refs.scroll.refresh()
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