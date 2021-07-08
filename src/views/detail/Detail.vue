<template lang="">
	<div id="detail">
		<detail-nav-bar ref="detailNav" class="detail-nav" @titleClick='titleClick' />
		<scroll class="content" ref="scroll" :probe-type='3' @scroll='contentScroll'>
			<detail-swiper :top-images='topImages'></detail-swiper>
			<detail-base-info :goods='goods'></detail-base-info>
			<detail-shop-info :shop='shop'></detail-shop-info>
			<detail-goods-info :detail-info='detailInfo' @imgLoad="imgLoad"></detail-goods-info>
			<detail-param-info ref="params" :param-info='paramInfo'></detail-param-info>
			<detail-comment-info ref="comment" :comment-info='commentInfo' />
			<goods-list ref="recommend" :goods='recommends'></goods-list>
		</scroll>
		<detail-bottom-bar @addCart='addToCart'></detail-bottom-bar>
    <back-top @click.native='backTop' v-show='isShowBackTop'/>
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
	import DetailBottomBar from './childComps/DetailBottomBar'

	import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

	import {
		getDetail,
		getRecommend,
		Goods,
		Shop,
		GoodsParam
	} from 'network/detail'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
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
			DetailBottomBar,
			Scroll,
			GoodsList
		},
		mixins: [itemListenerMixin, backTopMixin],
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
				getDetailScrollYs: null,
				currentIndex: 0
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
				// 在detailScrollYs数组里面增加一个虚拟的最大值，使其当index=3时，可以用来判断在两者之间index就等于3，【对应下面的方法二】
				this.detailScrollYs.push(Number.MAX_VALUE)
				// console.log(this.detailScrollYs);
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
			},
			titleClick(index) {
				this.$refs.scroll.scrollTo(0, -this.detailScrollYs[index], 200)
			},
			contentScroll(position) {
				// 1. 获取Y值
				const positionY = -position.y
				// 2. Y值和detailScrollYs对比
				// [0, 11834, 12469, 12759]
				// positionY在0~11834之间，index=0
				// positionY在11834~12469之间，index=1
				// positionY在12469~12759之间，index=2
				// positionY超过12759，index=3
				let length = this.detailScrollYs.length
				// 方法一
				// this.currentIndex !== i的作用是：防止频繁的赋值
				// for(let i = 0; i < length; i++) {
				// 	if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.detailScrollYs[i] && positionY < this.detailScrollYs[i+1]) || (i ===length - 1 && positionY >= this.detailScrollYs[i]))) {
				// 		this.currentIndex = i
				// 		this.$refs.detailNav.currentIndex = i
				// 	}
				// }

				// 方法二：在detailScrollYs数组的最后添加一个非常大的值，这样就可以判断在最后一个数和这个最大的值之间时，index=3
				for(let i = 0; i < length - 1; i++) {
					if (this.currentIndex !== i && (positionY >= this.detailScrollYs[i] && positionY < this.detailScrollYs[i + 1])) {
						this.currentIndex = i
						this.$refs.detailNav.currentIndex = i
					}
				}

				// 3.是否显示回到顶部图标
				this.listenshowBackTop(position)
			},
			addToCart() {
				// 1.获取购物车需要展示的信息
				const product = {}
				product.image = this.topImages[0]
				product.title = this.goods.title
				product.desc = this.goods.desc
				product.price = this.goods.realPrice
				product.iid = this.iid

				// 2.将商品添加到购物车
				this.$store.dispatch('addCart', product)
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
		height: calc(100% - 44px - 58px);
	}
</style>