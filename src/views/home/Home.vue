<template lang="">
  <div id="home">
    <nav-bar class="home-nav"><template v-slot:center>购物街</template></nav-bar>
    <scroll class="content" ref="scroll" :probe-type='3' :pull-up-load='true' @scroll='contentScroll'>
      <home-swiper :banners='banners'/>
      <recommend-view :recommends='recommends'/>
      <feature-view/>
      <tab-control class="tab-control" :titles='["流行", "新款", "精选"]' @tabClick='tabClick'/>
      <goods-list :goods='showGoods'/>
    </scroll>
    <back-top @click.native='backClick' v-show='isShowBackTop'/>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata, getHomeGoods} from 'network/home'

  export default {
    name: 'Home',
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
      HomeSwiper,
      RecommendView,
      FeatureView
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      // 3.监听GoodsListItem中的图片是否加载完成，如果加载完成，则调用better-scroll中的refresh更新滚动的高度
      this.$bus.on('itemImageLoad', () => {
        this.$refs.scroll.refresh()
      })
    },
    methods: {
      // 事件监听相关的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 500
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
          if (type == 'sell') {
            res = {"data": {"list": [
              {
                "sku": 11292043040,
                "t": "宾色短袖t恤男圆领夏季薄款棉欧美简约体恤夏装短袖男修身型印花男士t恤青年纯黑打底 黑色 XL",
                "jp": "6900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/95308/16/15715/111979/5e74fc1fE4c2b1c5c/5d9a51a8afa721d9.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMTI5MjA0MzA0MC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4wtK4hNNEszpgtk0glDSnqiIRZFi_beQU3V_Zz13deLTk5MJjWoYT7d_drc2SHKpK8TAy1sZhLvrjWifijELIm_gmrQ43qtn7I4jtjFCkX4OcvnKPsce8DkD4l-s0D9z3OtT0OqksUSyPbvizrd6563K5G3bGHgmdtSuIet7SDL27qQFIlBM015UX7w3hDobnHxFuQcnkQlZKGPkzw3KPoqmd8iOYWlGTFozPGWqwzqVeegABC1LLT0WNZn4rbL-4k4RvJeVtrmeWv2QxoKij_wGqJIgTBVQpzOgWBijsh3RZvpfS1ZlEq89YnUp_b5CzyrlR8Z9fPShx78n5egGW4lfyWuXseldenaZPkfrrF3IOsBOKGGbyfESTfVF868P_Zwvc50Zcg7rMFAGzW5MN4QuOlxDG_YxTfIYaxGOqwwJ8NyMOByryjCgs0Udp9Zjh0UkDev7lVjSUojQRYd1LFYQ4848x_vkbgSNtragUa4f5fPnfset1stxRkCAF8aG_1pFVc_KWQnLPCSDXzbsW4YZp5jB6gCr9g4zCt8BcY1tr1YzCXYpjxdOM4x69UirwS2gcZmMlH14wyspCa1ffFgOsNxARU5wdG043WIGNjKrvPHsEIHXbXdmS3ScafaroWhp-mJKQL1p6xTPHSsCjaqZ5YAryjF869B8iggoJJ3BD4Dkua-XD8QnL02h6fCyIK6kMPt2uAjDgiPp3M4MV6EsJ3UXij5hC1IA4QE-4epGI9sBbfuhspN4L4TYO8wkn7okrUDvxxn-k1t3LYunwQMfrrYJoYN7hVOpXJhN9Qa-_OUsgSYA6gYG2eGd1SivKgkgzX3UbJ0lwqAqZkLYyh_uiZI18veUrFFMjZsMJAVm1ubmgaE8qG3hWN-_RMld8&v=404",
                "link": "https://item.m.jd.com/product/11292043040.html?_fd=jdm&cover=jfs/t1/95308/16/15715/111979/5e74fc1fE4c2b1c5c/5d9a51a8afa721d9.jpg&pps=reclike.FO4O605:FOFO00A10EE724O13O6:FOFO0FF0416O84OBFO3O643O7FFF5021813FO8O2A10EE7201D91C0F6FB10078E",
                "source": "1",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00A10EE724O13O6:FOFO0FF0416O84OBFO3O643O7FFF5021813FO8O2A10EE7201D91C0F6FB10078E",
                "rect": "0",
                "c3": "1349",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/51TbL7PD_wU2qyPGFNQLiF",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 68242777298,
                "t": "自动大雨伞s长柄抗风德国大号双人三人女超大号双层防风男士晴雨3646 120CM酒红单层2人",
                "jp": "12800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/116901/4/1787/85801/5e9b1c68E02cb3824/c060c316252807fd.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=68242777298$index=5$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=800ed93d563f4771092b55408741170d3c40c13c",
                "link": "https://item.m.jd.com/product/68242777298.html?_fd=jdm&cover=jfs/t1/116901/4/1787/85801/5e9b1c68E02cb3824/c060c316252807fd.jpg&pps=reclike.FO4O605:FOFO00E39624D23O13O6:FOFO0FF0416O44OCFO3O643O7FFF5021813FO8OFE39624D21D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00E39624D23O13O6:FOFO0FF0416O44OCFO3O643O7FFF5021813FO8OFE39624D21D91C0F6FB10078E",
                "rect": "0",
                "c3": "1656",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
              {
                "sku": 10610621029,
                "t": "卓浴卫浴混水阀明装淋浴龙头加厚冷热浴室水龙头卫生间热水器阀门混合阀",
                "jp": "5600",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t5731/269/4570730088/192743/bb607f27/5950a802Na1d3bfb5.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDYxMDYyMTAyOS5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4PuguvniFTzqxHzXLcGiac27IATQjNdzwHCVJJl2ZSlh_dKRpuyfCGyhveunhl48YLPHa4GAjzPrgWuh4u1QWNXC7mkJG_TKFWvqUBZCh3paLA5jpRQVoyGHMlR1Wz7SkXiFcU4ju_-48aLyUMfGAf7XJesgMVfm3ZvF_8FSNF8u2QWgictIb_dLFjS9oPv1Jbm1petLE0CMWd3Cp65JoBPn4Og7UTicIczHkfol2M-ct1p63AzKqLFFDDC9DkRsqAiF5U2EuvQrI6e4kP81ISHj3SHLjDYLDPPfZanUZUoBrWgWokMS54BT0LUMUCbOO8lzfnxKLFvsSGQA_5O9zCOsvaMNzJUnYKcbiHBbrLNN17Nq9-mdDZkeh8mS8qADiJEf_5U8FKTP_5nVUSz-99V7IE-zKzgr_8asYCrJr_386nFwFoPctQ_7oO-8bRAVgJz7xIN1X9rwZkaOvZ2s9jQESJImUUdo6uX-ssw0sZmQKiQscJDgOC6K1qhiGHldWwgjTOku-pZl8xELlapA6ys3uS7DJmRb-tJyP5DmtMAvCWfJG5a12D4FeNhQdh0aC3CBgsdGNFm-3-emyOHgUfz8QDhNuMI0tN5MDKFlYpb8pi2ZgNB4adDWh0leMzVEdV9HS5rQS08eMoBdKXRpE-b7sDMPqKn7y48k-HsQLT6DEJSOiX4KVj6WeadjrGMONhgSAn3bAB8YgQeM5Z3jWcO-unGdr3lKyjZOhrI1DWU41utEswrEhiOdscViDLPrcAF1TsoDlRhskR9SqLD6wNn3PfckN2G2E2cWFX8jJZ7mkXCbmCShIlDeBIxhBMuo0afrJC581_m7qNiXJHS5OjN5h8u2kYFtNtAS1o4Lo1lA&v=404",
                "link": "https://item.m.jd.com/product/10610621029.html?_fd=jdm&cover=jfs/t5731/269/4570730088/192743/bb607f27/5950a802Na1d3bfb5.jpg&pps=reclike.FO4O605:FOFO0078713A653O13O6:FOFO0FF0416O823ODFO3O643O7FFF5021813FO8O278713A651D91C0F6FB10078E",
                "source": "1",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO0078713A653O13O6:FOFO0FF0416O823ODFO3O643O7FFF5021813FO8O278713A651D91C0F6FB10078E",
                "rect": "0",
                "c3": "9909",
                "tips": [],
                "icon": "1",
                "icon1": "1,4",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/0I-awI6BBmk2L_-RjpqEPV",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026735553731,
                "t": "板栗开口器剥栗子剥生板栗夹子开壳神器去皮工具家用十字划口机1118 304不锈钢板栗开口器",
                "jp": "4100",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/166391/38/7668/151936/603348b1Ee5f3d04f/1098f6242144d839.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026735553731$index=6$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=daa3b8b3c000e63086ab088c1173e58eb5d06cab",
                "link": "https://item.m.jd.com/product/10026735553731.html?_fd=jdm&cover=jfs/t1/166391/38/7668/151936/603348b1Ee5f3d04f/1098f6242144d839.jpg&pps=reclike.FO4O605:FOFO008802CCC33O13O6:FOFO0FF0416O44OEFO3O643O7FFF5021813FO6O91E8802CCC31D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO008802CCC33O13O6:FOFO0FF0416O44OEFO3O643O7FFF5021813FO6O91E8802CCC31D91C0F6FB10078E",
                "rect": "0",
                "c3": "11978",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
              {
                "sku": 10027496789213,
                "t": "AIMAKISS潮牌厚底网面老爹女鞋2021新款春夏季单鞋百搭内增高运动ins潮鞋休闲鞋 粉色 37",
                "jp": "49800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/159782/15/12039/295698/60477731Ea1c19703/490edde24c417e32.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNzQ5Njc4OTIxMy5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4Gj603j9vKSMqecRPMFDahhhyeA0tsbprn-M-k5PYxmt1QvLpGYOfAJqQcuw2EN1vqcLH8FIwRsnIPf7gAM1F0ASKoy3HdZ-SOpI_G6IoN9FFuCCNvP2UEt6KoqsYC_3L9DaTktCwTRcLCoXql2ZmbzsJaahaS2O-0s9r5WRHZKrUrU_Xv4EPXAPKAGGb_tnWiJ5JvIUCz1YMfN30Bg8eIX1falMczvacd7eFW-d0qtXy-tCHgACqsR1SJlNIBuRFkbuGYvhd2LsI5zBvv9fvJOKaPEDyVUzgYzLpEXAejfisaHNxjxqyk64olfUfkvjkQpN2F2iLOcAxsI_6ch29y3HVJ1gYI3HquGhQHWnHYBqV_duON3JkrpTT294UQfAGx33xRuuU3aQRwZakb6RzDDHfK5OAEkicsI2_WLAW0N6yDCSmymvHTtliuvdCxiXx96xy3wW9UsfVbsItZR2E_y_LpYaFoe9LMPYu83ZFki2449O0QLqUnbyIAozhQEU8cwxz01uChdwtNCZsQcDym66y1teU0kqmeigRr72NYH-_Fx38IHBQZjUXVzTOGojBeyDoAr0OvHWK1QMrnwpWyZUbbQ3f3WaPlx9Xajk6IcYAyjoueXBXmtKBzW97t4LojHf0_c1FKrY21OVE_BWE6-qkMyeOfHLAZwFlbCYlOwqP-ALwA_yvDtbOyOmPLBiA2vMrpEy1NojAyrJvpa4eqIxq3PuOeh778hreakAcsxAHS_8m0Ka8K1mBGnKEEN-Dd9IZXut5OzF-7TZ0hCKPGx6XzrOobGqSddBXbn0I1bWDr8NZYPhDQAVmdCsuHk68VVJh51GQ-jAe51YvgX_pxRkATEkPM3ben55Wc3niLklEOwJlGk2VV5-csCJkoZgk&v=404",
                "link": "https://item.m.jd.com/product/10027496789213.html?_fd=jdm&cover=jfs/t1/159782/15/12039/295698/60477731Ea1c19703/490edde24c417e32.jpg&pps=reclike.FO4O605:FOFO00B56254DD3O13O6:FOFO0FF0416O84OFFO3O643O7FFF5021813FO6O91EB56254DD1D91C0F6FB10078E",
                "source": "1",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00B56254DD3O13O6:FOFO0FF0416O84OFFO3O643O7FFF5021813FO6O91EB56254DD1D91C0F6FB10078E",
                "rect": "0",
                "c3": "6916",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/1w2cxuCOnak7lpG_1hMz3Y",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026741028993,
                "t": "红酒醒酒器套装水晶家用欧式个性创意奢华高档快速1000ml分酒器壶6869 强化水晶 带把醒酒器 1500ml",
                "jp": "8700",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741028993$index=7$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=6db6cd22b3a81ec0ef1207cf63ba5690c36da4bd",
                "link": "https://item.m.jd.com/product/10026741028993.html?_fd=jdm&cover=jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg&pps=reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O1FO4O643O7FFF5021813FO6O91E885658811D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O1FO4O643O7FFF5021813FO6O91E885658811D91C0F6FB10078E",
                "rect": "0",
                "c3": "6225",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
              {
                "sku": 25512318288,
                "t": "花花公子 长袖衬衫男 中青年2020秋季新款撞色格子翻领宽松衬衣 商务休闲时尚免烫男士上衣衬衫 127蓝色 170(建议120-135斤)",
                "jp": "13900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t21766/170/1523439135/328642/e8e73cd4/5b2b5ce8N50ae127a.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8yNTUxMjMxODI4OC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k5NEIFzKo-1SMtN6NrbK7rPJjfLWyNbhEhwJb1R7DL2_qj8L9vER7yDgmNyOQBzql9dqvPEY7RCqV7J8xwHVVbJXBLUJxbSPs7uxmUxWMS8gY5xj0_2VJd65rWGJ8J49s2O4H-HjP_Ui7StmAzZZSmmF_ipAjs7Mi9Q_Y_Ye48kdsSOm7YLYSRXol_9s65mKA_CDPm3fejym0e0z2i8a5k9CsIAs4pIl5NIMeet9U4zU5dPfmJmp2hZFFfvueXdkSzbgRlas5_FZpU5dY5ojXgbtNSCVbKwX5Rgrn0OFx8DjGfxx9JsIsApRXXpwtoqUuoRO5w2TwE9R5zjPSMBS8MuZxtSwwbIqTmkFYzpUyZogpGZyE9GW8NKXfTZPBYm_pTn7phF2FbG9A0HD588M3B0jAriFwPpP1THfq9tH4YSCpurNSljXRKKD2PZkIw5ySy-UtQzyusfiTO9_yvQiJvECXmRg3hgqcUe6w2g3d8GyX7KMsAfVf5nS0DGwLi0L7jVaQS-cOQNAjY4AVJzug7nUJriymGx227hoShq51ZynpfhoAd-jcksq_sPZB16YFahVH8MFzkMWqXf6gYoSJQI9nfAE7HraBdxjPpFmVgeUwqV23cVeKz36-1v3DA7riXlEOu8aN7scYDGdhfp2mcH-vju5dCLu3v3snn_gGOZ2yOpeQTRHEWrVzEsxcYfjuaMHvh4wF_FICkzwfHudhPHSha7Ns6ETWTP4qDytxXm6msTQS0RV5_z0N__z9JYMJkQL63kSYj87dZAblqDqEE1jS3yWvRrq4_NsMPX5MqwCCIhwnOjEIIsltXYrvo52eM5PzrScXQQffji10JXm5U012AvDYEu1ZTvPhMReyQSr2DiMk6C14XVPuP5yHQdofUZu_dgCzm-82h4bkE8SF6JqZgh00E6KMUrDxfEp50ZFeknbjdXSJP7ZyYMejrizutqf2osCy-vhEHGxLIH4CrkXw102URnasOLDhG6DJ0mCcX9H0v-FhFSX_OuCoNDWYA&v=404",
                "link": "https://item.m.jd.com/product/25512318288.html?_fd=jdm&cover=jfs/t21766/170/1523439135/328642/e8e73cd4/5b2b5ce8N50ae127a.jpg&pps=reclike.FO4O605:FOFO00F0A71554O13O6:FOFO0FF0416O83O11FO3O643O7FFF5021813FO8O5F0A715501D91C0F6FB10078E",
                "source": "1",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00F0A71554O13O6:FOFO0FF0416O83O11FO3O643O7FFF5021813FO8O5F0A715501D91C0F6FB10078E",
                "rect": "0",
                "c3": "1348",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/ahhCkQVgNkEa5mosxCX3Ed",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 100000253890,
                "t": "小米路由器4C(白色) 300M无线速率 智能家用路由器 安全稳定 WiFi无线穿墙 工业级",
                "jp": "5900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/64656/9/8204/129172/5d5fca63E6fbea57f/26e87c16af99b884.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100000253890$index=8$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=47852c94dff0e22b233737f2aa57fc2699271c8a",
                "link": "https://item.m.jd.com/product/100000253890.html?_fd=jdm&cover=jfs/t1/64656/9/8204/129172/5d5fca63E6fbea57f/26e87c16af99b884.jpg&pps=reclike.FO4O605:FOFO00487AC7C23O13O6:FOFO0FF0416O440012FO3O643O7FFF5021813FO7O17487AC7C21D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO00487AC7C23O13O6:FOFO0FF0416O440012FO3O643O7FFF5021813FO7O17487AC7C21D91C0F6FB10078E",
                "rect": "0",
                "c3": "700",
                "tips": [],
                "icon": "2",
                "icon1": "2",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
              {
                "sku": 10026741026892,
                "t": "爵杯帝王杯玻璃创意小号白酒杯套装2两个性家用水晶中式仿古酒樽3301 帝王爵杯-10ml-6只",
                "jp": "10800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741026892$index=9$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=af3bdae91f5a67ddce44d80ca6a7583758ddad92",
                "link": "https://item.m.jd.com/product/10026741026892.html?_fd=jdm&cover=jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg&pps=reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O13FO3O643O7FFF5021813FO6O91E8856504C1D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O13FO3O643O7FFF5021813FO6O91E8856504C1D91C0F6FB10078E",
                "rect": "0",
                "c3": "6225",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
              {
                "sku": 10269776770,
                "t": "索尔诺置物架层架收纳架家用搁物架台面家用浴室客厅办公桌上整理架子Z613 z613【宽42cm*高55cm】",
                "jp": "1200",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10269776770$index=10$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=bd61fbe7f06419f1645e7283f056f084870f28b3",
                "link": "https://item.m.jd.com/product/10269776770.html?_fd=jdm&cover=jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg&pps=reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O14FO3O643O7FFF5021813FO8O264205B821D91C0F6FB10078E",
                "source": "0",
                "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                "pps": "reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O14FO3O643O7FFF5021813FO8O264205B821D91C0F6FB10078E",
                "rect": "0",
                "c3": "9888",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                }
              },
            ]}}
          }
          else if(type == 'new') {
            res = {"data": {"list": [
              {
                "sku": 10026901795932,
                "t": "朵唯 5g手机 Mate40 Pro Max 智能手机 双模5G全网通 可用双电信卡 华为通用充电口 银月辉  8G+128G",
                "jp": "119900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/168217/28/8963/171794/603f6784E141f65e9/8ce9fed7cdbf6f4b.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNjkwMTc5NTkzMi5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7tQ_ZDoxvTUzAayBqm4ut6jgB41gTVp2mew-xuFxFsykFdT7b9oZ0Mq3_FRAaEzT-rYwu8kYQXUDjXS-OVsByw5-tnIMYh3SuDz355j6QqHazNKoJwN3UFYl9K3f3J_imykB6m4dV4h1Do4UV0MwuxVarCgYklIdQ4-wai46K_ZLZ0mtEjxBsXyt8WHheaq88Sa4xG_GxhTdJ7Ub8mGwm-GmYs1z0O8a7PX7EodbB1hHBf730WRihE3frC2GRU5tLJBQDPgF01B-KV6Sw5Qdi1ii-63kA99kI5mlyrO0ildhIn6bFUOEzgOmh542uRfpEVaXTIn_qywcTakgqLu0Bb05IvfXfcuNwXk0Pf9Xqqxbyk9UIn-YR73_PHfP8qF4i6dB6FScsWrk_AbCtvrUddlgSw9HzI7ZyH22MlkcvXjskDir-B0Ii722GraHBrxHKhztJW3y2mdmjrJTOuY_xODtOXV2EBSgTfabd3aAd_JfpP8lFNj8_LFS00YxNlk4W6myQNXp_xzMZVQgA8b5SWXAY8oCCcbKFsXxWmjgbLcDE8995e3YPq7Uvz3KdlVobA82CzK99imbYkcSYDW3z3RULGkVXSKDmM42ZOHYBt8HbDWK2vS-02sYzWYJySy_pwPFaXalPiLQykSUgKc--zpTpoRxYKZygZxXEKFpqjvfywpL58uU76Orru30GhQyVlP_lhbeZk_uPgx6TZpFUyD91-LcCD7w5A91NfIfIu5ZCtIS0ZHBoJzGAYdvtI4ww9rqkAs3MNzkhipcFWrvUyeF0j4g9o1WyTfOpvv0af6pV2fjgWAo0Dc_LcKOhsRwRFMbtqvxdXgg-sWyeGenbwthTKHGl6vXy1fdxzshwraGg&v=404",
                "link": "https://item.m.jd.com/product/10026901795932.html?_fd=jdm&cover=jfs/t1/168217/28/8963/171794/603f6784E141f65e9/8ce9fed7cdbf6f4b.jpg&pps=reclike.FO4O605:FOFO0091EB745C3O13O6:FOFO0FF0416O83O2DFO3O643O7FFF5021813FO6O91E91EB745C2C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0091EB745C3O13O6:FOFO0FF0416O83O2DFO3O643O7FFF5021813FO6O91E91EB745C2C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "4",
                "paicon1": "4",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/eWDeFqEUzPb1bhvlLsmzmO",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 64421715300,
                "t": "心家宜 无痕衣架 衣帽架 家用卧室挂衣架 防滑衣服挂架衣撑防肩角大衣架宽肩 混色随机发 10个装",
                "jp": "1200",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/92770/37/7990/268713/5e002bc3E3ab3f8f4/a10376be632e2590.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=64421715300$index=0$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=ac465e895a00ffc539368e939a9128696fb74d0f",
                "link": "https://item.m.jd.com/product/64421715300.html?_fd=jdm&cover=jfs/t1/92770/37/7990/268713/5e002bc3E3ab3f8f4/a10376be632e2590.jpg&pps=reclike.FO4O605:FOFO00FFD55D643O13O6:FOFO0FF0416O43O2EFO3O643O7FFF5021813FO8OEFFD55D642C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO00FFD55D643O13O6:FOFO0FF0416O43O2EFO3O643O7FFF5021813FO8OEFFD55D642C19C107F50D6D8A",
                "rect": "0",
                "c3": "17078",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10027038960208,
                "t": "vivo iQOO Neo5 高通骁龙870独立显示芯片 66W闪充 双模5G 电竞游戏智能手机 8GB 256GB云影蓝 官方标配版",
                "jp": "269900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/167033/39/21014/146654/608700edEf1b5b342/5a15caabd7993dcd.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNzAzODk2MDIwOC5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7uHOcpzPXNskbrSWV-oOjRT9mSwaP7CqqwePQrcbvmWuuSzw5aCbr9PZf2Hay-xkuv4VIDc05l9RilvGpPgv-bS_kQVrp3ZpHSMUNpQioZPbSGXnpJlWvc3Oqj7P50EoG2QqIgk3T8GetBE3SpCwiK5cv_raSCtPbhfNmCqK8uet-UYgNNvRDsxkcf7SpLmCr75qgvhs17dLjEBTo7iagAxVpgAKxSoE42t9GOAW7zkc1e3fF-aVg3s1LpRO42yH8WiRDCM8A9i9YwZUaGdjcCwfVOKc4V0t3xSLI2zkvfpqRd8_JAwhADqLOKS_cF2RQmXZycv8Ee5v3jIZKzUKkt0uXADlCerexEK0dYUESZNpO-webiQY7jtAi2pBkS8L3Zrh1UUNlNQ-MRxSEkVCSJGqZytxSP3qodu7RKdWWdSNpAVAvEungSZ50fVCk--AsOOlwgfyArpkL_uAGdoUDGNHHGjhREEkSET4SuJcvlV4OXV6iZ7T5HQh-H0E_C5xBRXCUJFk1MKPYNjNkVnd4sJrUKSeONc2gENux31RqsajwSlTwQb10Wk5Eu-Jf3EdpDjU45IUchPRPy0SI9l0ugVEfHFIHgvKSUVa2m6WHNrwVvw5yDOaMhPtrqKAAX57CFZepxnYxHgYpJnWEPmCyv1ZjVOdVnn8ktoaMOHy4GO8Dbv3MeURW_S-tQZclJM55IKkQBry48pJQUUxltuEfzRfqH0UBlZyJDTDtiaoejBUGwxRE_BsifrLZpD7QYd25M7HzaPrpJ_BF963LmePj2e6n3MUhRMz3sKT29sFHxn2AgSQY2Db17mgoK0oux-r_zRqM5nHkBT33YdoZQ5KNrImCXafQ9NDcZdnbj0cXi8GA&v=404",
                "link": "https://item.m.jd.com/product/10027038960208.html?_fd=jdm&cover=jfs/t1/167033/39/21014/146654/608700edEf1b5b342/5a15caabd7993dcd.jpg&pps=reclike.FO4O605:FOFO009A186A54O13O6:FOFO0FF0416O83O2FFO3O643O7FFF5021813FO6O91E9A186A502C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO009A186A54O13O6:FOFO0FF0416O83O2FFO3O643O7FFF5021813FO6O91E9A186A502C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/bo1Vfz3RXGgbDIZjybwwvI",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10023983700435,
                "t": "IVGO 蓝牙耳机真无线双耳运动跑步游戏适用于苹果华为vivo荣耀oppo小米一加手机通用",
                "jp": "3990",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/195658/13/166/468891/6087cdbeE5af69870/1d3c5ac1ac217742.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10023983700435$index=1$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=86f3b66d579912a5bde297f8162e198282ae387e",
                "link": "https://item.m.jd.com/product/10023983700435.html?_fd=jdm&cover=jfs/t1/195658/13/166/468891/6087cdbeE5af69870/1d3c5ac1ac217742.jpg&pps=reclike.FO4O605:FOFO00E3FCD9D33O13O6:FOFO0FF0416O42003FO4O643O7FFF5021813FO6O91DE3FCD9D32C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO00E3FCD9D33O13O6:FOFO0FF0416O42003FO4O643O7FFF5021813FO6O91DE3FCD9D32C19C107F50D6D8A",
                "rect": "0",
                "c3": "842",
                "tips": [],
                "icon": "1",
                "icon1": "1,4",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10025513692142,
                "t": "【12期免息】OPPO Reno5 Pro+手机 5G新品骁龙865 65W超级闪充 拍照游戏手机 浮光夜影（8GB+128GB） 5G官方标配【晒单返20+送1年延保】",
                "jp": "399900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/162504/11/21116/147587/6088c3feE939f967b/1cc87b576cb74b9a.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNTUxMzY5MjE0Mi5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7utRh3QgTwOJ5bsCf01RHDa64qTaNjF1x0l8XcIlCSwU3hCflf_zhXyQqcMNwkrCcBvE7sdMsdmFBIdjryIVntkHBrR9dEwoIytCn-QhdRe64keUo2SnfnIv4-8jqMBoZdRONb69mhBQDx-3w6C7X0fEAvaWRYH13pu_b3qW8GHbuzkmnLfBkJx3E2NLa8Nc9I8L0JF3zDMu8gSiFwq1CCsc0EzREVhxciIpL4P2sCGbBLcUP6aD_72LHFVLabmM0R74bcbE0WcNUHD73mPQbwLplY9YwyJE3rRy_aH-SogI1sVhqWFmug95XGIGPi-PtXQYor7mFJYawZVLfMtYQsnqvzwZ_U9fSfkDhVQNLFqru8jLgwxooWs7rjv1Q1O4mJDLizJgH2q0a5HKhJnRJsnWKINKUY71v-F5AM6FhpVD4kW__r3X6ndwYT6w4dG2DTzbyL0IO9luxd9QP-abjKEWshzaL1yg90a8LBS8sXFvWtTmu-0-73LRAYMmU0BOU5D67tsbOtOuQ6nYcjKVOL6IM_lxqfuYWC2jmgBhsHwtop5R9H_kQCvCIW7HEtPPNBGGIcTsXheWLbTHVNjStMC-gDbKzLgLG8s8oBz5X1Do2syCIYgcBo05KFJNM4pqqBw5KPxkyimXXhHglu6Ogkr3K_RAfr4FxRZqX5GatZrvsNGtfSNXFPaMykuTa6FP27xJQf-1GwzUH-XtcFRWlsM2ghgdrCsF5iAx3VGAQMZ1iJh3Lx7vS_ZxIwYDV9tsSGqtAs8E_LbbjTVCwxH5QQ9hoOtwkgJDEXz9GpB-oDAGmydQRhom1Rt4T7Ss_VQhGYS4qjJExfmCBoLJf4wIVyEihRlqqYsYs0TIgO9BYCGkrkoHriqvPCAtzV0ja8DsbU&v=404",
                "link": "https://item.m.jd.com/product/10025513692142.html?_fd=jdm&cover=jfs/t1/162504/11/21116/147587/6088c3feE939f967b/1cc87b576cb74b9a.jpg&pps=reclike.FO4O605:FOFO003F2EABEE3O13O6:FOFO0FF0416O83O31FO3O643O7FFF5021813FO6O91E3F2EABEE2C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO003F2EABEE3O13O6:FOFO0FF0416O83O31FO3O643O7FFF5021813FO6O91E3F2EABEE2C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "3",
                "paicon1": "3",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/8t8f87lKf397ZBpxX8I6I8",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026964771861,
                "t": "杨妮2021夏季新款韩版男装宽松显瘦青少年帅气短袖印花T恤A3-1124-1602 浅蓝色 M",
                "jp": "6300",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/152911/14/20546/186097/603a399bEc24a422e/4a1e11429d7839eb.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026964771861$index=2$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=ae9cf29dc3aca43a5c0a69584c8577be7fec4652",
                "link": "https://item.m.jd.com/product/10026964771861.html?_fd=jdm&cover=jfs/t1/152911/14/20546/186097/603a399bEc24a422e/4a1e11429d7839eb.jpg&pps=reclike.FO4O605:FOFO0095AC64153O13O6:FOFO0FF0416O43O32FO3O643O7FFF5021813FO6O91E95AC64152C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0095AC64153O13O6:FOFO0FF0416O43O32FO3O643O7FFF5021813FO6O91E95AC64152C19C107F50D6D8A",
                "rect": "0",
                "c3": "1349",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 44372312503,
                "t": "奈客保罗（NAIKPLLO)男鞋春夏新款男鞋透气休闲鞋轻便旅游户外跑步大码运动鞋男百搭软底波鞋 黑灰 41",
                "jp": "19800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/23298/32/13413/102393/5c9f3c09E97ff4586/c38e5c382059be78.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC80NDM3MjMxMjUwMy5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7tv5KiN8Q3sqLWVUVzd9bPzVvCGnpGJI45DnOvrI2jMwLTUPSQ6p7QiPOuBadLjh_5nVdhj8MMUu8_g5dezy4lxH2Pt15s3_JKpC_8LLtYmCxyM04v_D3cY51h1SqYa0hNq-UyJOZqrnIkMqgZeUjUfTq2gGL2qqbtY_bOLbKL8vm8D7Bpdt3QKkCuNtsQ79u-rVLfOiE9_5wZ9g4PJ9Cenc96SgNkAgqDufLi8BuQW-7E5DgtfBKn_M6CQVYBhT8ChFPRSJNDDmY12M8XkEZnhD8M70VnVJOm1rDjnk-P7Zg5GAfk1TP86_YT9eRssRofGsYzIsFLdMY-4YMuakPQuOwvUc0DqGdLOZzJFccR5zt_jo852bPFwVZwjeEhRDXU00JfKxjwQ3VmG-I9z7EIse4CXxtNNT0FhgXZSx-VJBV8-XVdDj32D2wuSztp1CGQA_SGsKnuQxQpGEoN8poKHlignw3cP4t-sFaLrVV8FQBUuG7eMG8V43x96wUjOk_lqpeKqcFcvWuxgLP3fIG4c3uBcZFnP8WroUxgKXGFClvP3CeWTTkV-eujGW6zpBbp7CKOmWwrj4-2RHqNsm6XKETNwtuHhdGtV76a9q-wAqTSq1TLfJ3V-spZxwUPon5jpEOaR2W6aj8_WZ2p6jnqP0-hVCPQVq0-JLKIdymcBfmNYFB3RnmT29NrgN5-3wN3KlTOc5tOkA79TNTmgpAC_YxvIgLYyJFIenFITFq6NJjzdYecQRt2vhpVUV4XUBWz1Ov1qawoBTUCrWSBzRSRCziuB5ENMmvkrlUQS9bxMEjhttYkqT5iXtdAaM7K5TPyla0FQqh1LMptzPj4gvPLdNIeIoz-OKc07LznN1lWf3f6E3dyS_IDJgIgQBDnk-5NjOr7Kom-jtIwPqZjfyxuaGWgHABrZ2Vh11dwg2N97bGmYoasnaXyW8rUYl9MgMYs&v=404",
                "link": "https://item.m.jd.com/product/44372312503.html?_fd=jdm&cover=jfs/t1/23298/32/13413/102393/5c9f3c09E97ff4586/c38e5c382059be78.jpg&pps=reclike.FO4O605:FOFO0054CBC1B73O13O6:FOFO0FF0416O83O33FO3O643O7FFF5021813FO8OA54CBC1B72C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0054CBC1B73O13O6:FOFO0FF0416O83O33FO3O643O7FFF5021813FO8OA54CBC1B72C19C107F50D6D8A",
                "rect": "0",
                "c3": "6908",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/5BptvNxnwPm09fyd_EOFkt",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026741026892,
                "t": "爵杯帝王杯玻璃创意小号白酒杯套装2两个性家用水晶中式仿古酒樽3301 帝王爵杯-10ml-6只",
                "jp": "10800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741026892$index=3$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=f453322a604a03a0fbbf5ff83ef2943eb97ab07",
                "link": "https://item.m.jd.com/product/10026741026892.html?_fd=jdm&cover=jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg&pps=reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O34FO3O643O7FFF5021813FO6O91E8856504C2C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O34FO3O643O7FFF5021813FO6O91E8856504C2C19C107F50D6D8A",
                "rect": "0",
                "c3": "6225",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10025511587878,
                "t": "OPPO Reno5 Pro+新品5G手机骁龙865 65W超级闪充美颜拍照曲面屏reno5pro+ 浮光夜影【礼包版】 8GB+128GB【2年保修+晒单20红包】",
                "jp": "399900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/151743/1/10967/916096/5fe1a30cE3410708a/80ca6d98a893e3cc.png",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNTUxMTU4Nzg3OC5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7tIfoGqsV0ewr1vd4AC3woEFeEYcYG5QWcgactkkPpa3glTeDji2qVlKmD4WJT87fCxj-nedTgwkuTv3aAKRT7YlnD4ES9tvynHSMEUzJNTH9fohUepzCUsXuNAGGpfbnXdEs4wx04-7tr_Gmt3BFRd90OtDQF3qsqqBrmAEhrhtt5b61v0G3U6FlYBktSxA8hps-lPXRC4J7bkSSpsHtoW03nbZcau828aSIZwlacj0BPgz6gIw2smy11HuP6wypo_jted_1TxS29e_DptAV1eRCq3L0EN13tScEOUQdGCngLrd3ZmbA194FEDECG8ifdUmnxRnL0l37x0c1f_aYxAojGdL3BTDryDoIsCSe0khTPrU5LyWo4Y246805wPbIZMszRJMi3dDGf3d5NEqJTT2PdmFXVjZES5nNlNIXZBMRjvcBG-qdHgZYpGA1cXGxsTiIP6-l0y4DYRdc8NK74k_5epvLHZbgXEbikuQQpOmgHUCWvznoUgr1QzpqqR3tVm32mWJN2eJjqu-5m6PUhpl_cax9El2y2ZUmbcjOll1-p3VUZN50RONud1A8-Qca08BVhYc-GS7AY3oktKL-fvHM6w4Te1Rj6f4uoSWqjkY-_IpeiLPSlWuCXCKmnpnZc-kLRRSkV1z26QeAqUT0S9BRFrco7JF9YTB-hxub0th-rdyKwiWDcNQ9ehSQB6GGvgQ4Y9w-bTjtaqCN7ssosIlhUM5sXahfmKwf-CoElFkudxrSNgbqVedrC-YpvpMA7q5EONM62QFEXsXtei1TKnFyj7khhBkytPzR31jhASJsCbFuksgD2HbmW_mA0WD3DvWiKhzysqaZsI3Ysguquo&v=404",
                "link": "https://item.m.jd.com/product/10025511587878.html?_fd=jdm&cover=jfs/t1/151743/1/10967/916096/5fe1a30cE3410708a/80ca6d98a893e3cc.png&pps=reclike.FO4O605:FOFO003F0E90263O13O6:FOFO0FF0416O83O35FO3O643O7FFF5021813FO6O91E3F0E90262C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO003F0E90263O13O6:FOFO0FF0416O83O35FO3O643O7FFF5021813FO6O91E3F0E90262C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/bo0bLHNnLUpc37Pr1LGk7x",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026741028993,
                "t": "红酒醒酒器套装水晶家用欧式个性创意奢华高档快速1000ml分酒器壶6869 强化水晶 带把醒酒器 1500ml",
                "jp": "8700",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741028993$index=4$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=16e7dfb640a4892185fe0ecac936d087a465876c",
                "link": "https://item.m.jd.com/product/10026741028993.html?_fd=jdm&cover=jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg&pps=reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O36FO3O643O7FFF5021813FO6O91E885658812C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O36FO3O643O7FFF5021813FO6O91E885658812C19C107F50D6D8A",
                "rect": "0",
                "c3": "6225",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10025609548554,
                "t": "trsoye瑞士品牌手表诺曼底水鬼钢带防水日历夜光商务男表三眼6针秒表计时多功能大气时尚腕表炫酷潮流 间金带绿面（皮表带+调表器+手链）",
                "jp": "8500",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/151876/15/10695/169923/5fdf4faaEe3ffeaa1/ebb1ba65c8473991.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNTYwOTU0ODU1NC5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7t80Txme-7Jv0WXV_F2eoE1qF5_p_Yk0xkewuIqSCe65pUQhk3HSdPCZcmkbmK7lx0GGQvUqHU7WKBeg8IjxRn-rsrxXKGC65-LnUD4u6Q_YM337NYEdjbUCC8HZ1XerU_bJTU0Ryl87ZC6RLGLcK8dHFlbZj8lRWhL2IggFiSQpAJQRKt-1G9-Iag37Ot_R8IWrxXIiU2QpjFs7a1EaiYCxv_dVs_a_XP8fKYaPZPzwkff6qBLb1GH7r5CFt6WEwZZj4ylvfU7DeAK3nIrAzVT2SfozTm1Tc0toJCITWhXl2LYVvy8JEg6UEodzrxuHn9ZaKDzWoT7BU853ZuVpTEfYIcZZ1eQ94ksWCIbhkTprOsJ3COgzcTisu3JkfGnrFEurV4z2V5ZWpsj6RYdxUn_aseEMFp7WBsNvTdTDOYrZRVL4N8C074oZRYBBGDWJIM-J0ypWG74187TTfDsvDJGHCtzRb6BiSThmrA9d-Iu1TRsQmx4OH4YTgh69KURxN2PL--eILblQuWUqRFXu2V7C7q-joQfMbyPo4Po8ofspx6f7xpamJD96BgKUf0jTIzXNzauUYBus1dnz1O_aMzTplKJ8b7MDJFgzcbUccMda-bqYxhecL4MEsAl_NKBQY0GVNQLaT9dV2gGDm1pGP24aVEB29Y6efnXME1hC2OUGCaKUHjtSuIQi0Ol2vyLh9qEBlUoqp0-V-NN2dRcoztF7J2J-8esBoEBSWCBQW_Rhc3IDytF4M6IlOpTApcvMMPsD48UNEMWXaSLLqmbeT0HcYU4tpnXWdP6oXwjLrGB1dfVUq5rOc6_2V5GmUpbF1bLTazyr7BvuNDcWGgCml9O&v=404",
                "link": "https://item.m.jd.com/product/10025609548554.html?_fd=jdm&cover=jfs/t1/151876/15/10695/169923/5fdf4faaEe3ffeaa1/ebb1ba65c8473991.jpg&pps=reclike.FO4O605:FOFO0044E5530A3O13O6:FOFO0FF0416O83O37FO3O643O7FFF5021813FO6O91E44E5530A2C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0044E5530A3O13O6:FOFO0FF0416O83O37FO3O643O7FFF5021813FO6O91E44E5530A2C19C107F50D6D8A",
                "rect": "0",
                "c3": "13674",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "4",
                "paicon1": "4,1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/dket6Ir3KCw8Dk1dxlct-D",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10269776770,
                "t": "索尔诺置物架层架收纳架家用搁物架台面家用浴室客厅办公桌上整理架子Z613 z613【宽42cm*高55cm】",
                "jp": "1200",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10269776770$index=6$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=3dacd2aa6d6c3d235e8376bcb9fd3e7a6e507bed",
                "link": "https://item.m.jd.com/product/10269776770.html?_fd=jdm&cover=jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg&pps=reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O38FO3O643O7FFF5021813FO8O264205B822C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O38FO3O643O7FFF5021813FO8O264205B822C19C107F50D6D8A",
                "rect": "0",
                "c3": "9888",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10023624200223,
                "t": "小辣椒X50pro小米华为通用接口128G双卡双待智能手机微信QQ八开人脸指纹解锁学生老人游戏备用机 樱花粉 8GB+128GB+大礼包",
                "jp": "75900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/170560/39/14565/299729/605db827E72a413e1/a934ea318b61ce14.png",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyMzYyNDIwMDIyMy5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7vkpROn1V9KOeKmFef6eCgiQlcYZJnKc2boTUwQE8tZN2Vr4luZaGlcXMFo6SoSsicOGaTIIWMTm5Eqqds6v6TQGgIKNQhqagt0yYGBMcJN29eTNHMwFW11_30RKPw0Rp77pfT6_nmKxpiBm6SfmM62zqTiBsDpdgFFgWm1Q6is4JP7tReANv0ckuah0KsDiWvOMdCvNGqR5EJNMbxmY-VIIhA95QbHPL1S8Qj8Hac00r26JvmfLj6VFOs7LHxCmOAlAJxF4RPFHrjwASO5zYtGQFkKYglg6MEEzXS7-kXpSBtlXhKMeeKmBz-njl4UXXNvt-DRa3cXKczkleaIdGwfeRXT43_VQQn0-kxkqL_KUYRPy4M1_XHW5pn1YrxtTF_WPNAzJR31jisOrQGw1T7DBShCys-ciu4DuvAQsXm0d_STs1uk9fNrnQaAEmT34cA38lWwuCrNEsgyAEXizRee077ZIkArpjxNiVh0RnQw45r5apZSXAx_9Awch_nNW9-YKieDVNeylL1vgtjjZ-nreFmd_r0VDW8Q3Mhpxg8DnfqM3ec0V-OPZ4tfmk5DRsYXwypAurDZXWSN1MvYSoY6plktZwa0xaCGsGfUiFuen1MwZMtzrfMi_zO_mGAJbRf01b0ljU_zw6L439eFaUpwlQ72cqC0xHv5QXX_3i3LyUJtguks9OXmpSiZ37IdkfUCB4apvxXmkn0ikHx-C4dVsWXaw-0hUyr81CQZJeXA59-qiXCYgAGWyVooOl6Br-O2aS3kG5QHAEfZL_xejO5nEVn-u2gvLkV-rOnLVlw8IlmWK6tz8lN3nrVwMiZcPm6BMhKa9PNdJDawM_35jsAKrEaUj6ap8wTQ9zj2-cwZ4lWwveemIZB1HpQkY7iPv_o&v=404",
                "link": "https://item.m.jd.com/product/10023624200223.html?_fd=jdm&cover=jfs/t1/170560/39/14565/299729/605db827E72a413e1/a934ea318b61ce14.png&pps=reclike.FO4O605:FOFO00CE8F501F3O13O6:FOFO0FF0416O83O39FO3O643O7FFF5021813FO6O91DCE8F501F2C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO00CE8F501F3O13O6:FOFO0FF0416O83O39FO3O643O7FFF5021813FO6O91DCE8F501F2C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/36SSEbUZJPebKV_U6lNlhq",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026741039486,
                "t": "奢华高档水晶勃艮第红酒杯套装家用600ml大号ins风大肚高脚杯2个6656 【德国工艺款】600ml 水晶杯 6只装",
                "jp": "35800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/168576/18/7197/90884/60335ff1Eee4c11b4/3ca517fdf45c8a11.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741039486$index=7$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=dccab56c3d73a4a269c5be1c8ae586b554c790d2",
                "link": "https://item.m.jd.com/product/10026741039486.html?_fd=jdm&cover=jfs/t1/168576/18/7197/90884/60335ff1Eee4c11b4/3ca517fdf45c8a11.jpg&pps=reclike.FO4O605:FOFO008856817E3O13O6:FOFO0FF0416O43O3AFO3O643O7FFF5021813FO6O91E8856817E2C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO008856817E3O13O6:FOFO0FF0416O43O3AFO3O643O7FFF5021813FO6O91E8856817E2C19C107F50D6D8A",
                "rect": "0",
                "c3": "6225",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10025554213649,
                "t": "酷派（Coolpad）M9 128G大内存微信八开全面屏智能手机渐变玻璃机身学生老人双卡双待智能手机 萤贝白 6GB+128GB",
                "jp": "74900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/124844/36/8196/81442/5f1ef118Efd270ece/9992c4137ff169c5.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNTU1NDIxMzY0OS5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7vDE_EATS00l278N9ot6e6ztSZVPeDJ_kiVofV1ybBAdCh-xLGxT1PSIaAvt6I8fuzh9J2HClqwlIQT5aLrWxdS7fknGqjGS4pRNEO-_O7ZAa7cblEA4isdImLOBYMP9WpTAg2t6z5fkVeRVtExDUF_NL9dypDDFPgrHiUMcARwnfvAUEjcQS4nBA8vFcKyZnBtfKvmzJBjhoGrduovScVggjreJwpIUtd4yCnO-oMb_6aNPDlw61j-CeZcVqj22R3ovvCKeaQF3tbwaDIlP_Xg2FkRkuufuHMVt1GnyBru8TRS3ZHrNNQ10n5w-0-P2J4LCdSv6zS003nwJqxOh84yGoC_YuueonDVFMqeOCpn0SPlLYFC_XKk9TLo6VeHUdC2q02NWZSBDm7HZRlezUA80ST8aLc71mg4LDio-GFI1WilbrP3o14CQiq0lPVPeTkQFhllS6TfTIUBzjGQXmCkt6Cg95a1ZgURoiCXEYuxzOwcF-4-OiTiERmCCadslYQodIYZD19mJNMI4mfoStEc3iRj1YGWq8zuk5GS1Wf59qTx7gGyStJs8_rFlMzn0fxhV33GSfbHtpHJi_qQRiQEyJlAnAHkWPAKut71A79wSr22Ht1QB80uipRQiZq-_pLyhUuzk_2PjECmyaplFM_D8hv2ZTAyOh6Fog_JCTu8c5_e_InCxZ2_ZfwhmXbbDKmt2Inm8coOJXq7EWJAoLMN90spgMXbAg-UnykmRMCuwe1exJkyK5OGzMEa9VRuaFTWjZ786AtI6e1Rgveuo4YJ5TGe4JvsHeh2sPf8C6e0YZqPwY2TG0MwQml1CulfpBSyRNhfMYKt8daCc97uhILJcmo2cE9YPZUdrYqbQTHGHqXuBWj32v6FqApjdsY3mvU&v=404",
                "link": "https://item.m.jd.com/product/10025554213649.html?_fd=jdm&cover=jfs/t1/124844/36/8196/81442/5f1ef118Efd270ece/9992c4137ff169c5.jpg&pps=reclike.FO4O605:FOFO004198FB113O13O6:FOFO0FF0416O83O3BFO3O643O7FFF5021813FO6O91E4198FB112C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO004198FB113O13O6:FOFO0FF0416O83O3BFO3O643O7FFF5021813FO6O91E4198FB112C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/1kzfMY3ltD68Nya_Opv_GD",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 10026773510024,
                "t": "不锈钢盆304食品级家用烘焙打蛋盆特厚加深厨房洗菜盆子圆形汤盆6834 加厚小三件套(24/26/28cm)",
                "jp": "14500",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/158565/4/8296/444702/603494d8Eda21fb66/028f5e881cd468fa.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026773510024$index=8$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=a6a1e86a33178469d57b5831630ffce2ed62ffe6",
                "link": "https://item.m.jd.com/product/10026773510024.html?_fd=jdm&cover=jfs/t1/158565/4/8296/444702/603494d8Eda21fb66/028f5e881cd468fa.jpg&pps=reclike.FO4O605:FOFO008A45F7883O13O6:FOFO0FF0416O43O3CFO3O643O7FFF5021813FO6O91E8A45F7882C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO008A45F7883O13O6:FOFO0FF0416O43O3CFO3O643O7FFF5021813FO6O91E8A45F7882C19C107F50D6D8A",
                "rect": "0",
                "c3": "6216",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10025459497573,
                "t": "1199起！OPPO A53新品5G手机a72同款6.5英寸大屏后置三摄 视频美颜拍照oppoa53 秘夜黑礼包版 4G+128G【默认礼+2年保修+晒单返20】",
                "jp": "129900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/169776/21/2392/184227/5ffd72d5E34014503/8cb3db23946331cc.jpg",
                "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNTQ1OTQ5NzU3My5odG1s&log=D4UiF9EfzqCp7bi53ENISJAYfGG9Q6W1B2AF7NeSv7uTn_rDz4QJzuJDA2chhL74_CFXOFHEfvSXlttr1l_rHp9eoLHRRvmYPwctRnIcXHnM5_Vfb4ED8vKNyr3Qf8Q27B4OAMgNeOB87iVJpFkQPLoh8OZITbG5GgFMO2kVv5wH89_h_23BCmtV-OfgJUpWcFfmRALPHjCzIvaURf2sFFRChVvLfxJf61ca48_qC9bE9nw-58FfL9mDj9OwXT6DYu4ijnD7D5jjKbvyzqMmlE4FymMrxChhl5J6UEBWRke8IfjpObeZIPI7mBd9ZcBalUH1FKm-DflGnBVvn4ogFVAzx6Ka3ZmKc2x7efkQNy8BjG5hIem3HNgoz5dVj-oblG7WFtgyq63PzqRlkufLLa7skhWVvbRRmgxCaCxImI14MfA1eLhp6Ro93fvcon6CBSn7GNjxuzzn902Fq3mVPoV4_gqKettOIN_kqi8JcLiAmLAM5Pl85FLVXlMmfZNrWEd6EAojx6_rXTjVyCKPvJ35I300v8NvkCRY7Ucj60Ao2A5Odz-oTKim45ZiYeAH9sngo76WFruC-N68PHs4QFWgn3UxmO0Xo4RK1oJdoaC-zcj6M0j5725nI0ouOjE1hOhYi_Lwy22XL_VPKV4PS9UcIz_6p51lv7MMCWGqXXtmhhN_7MG50pP9UtwMk2whde_hJI_zVr0tDCdHUBP4iVDrw6byuFNBwL2Ka3WqqOXqrCHR8iC49oalFiDXoBPKpc-sYfBlncVDhsyHFLbWPMaREupgcfTPPhBtjmbntZA3m2yNcHDR3HAUfwNm19N_G-93577UKdKIWINuZdYr2qXeimVNlCb-Hh8Gn9LXgn-fcNku2bL4_myErm20Q81i&v=404",
                "link": "https://item.m.jd.com/product/10025459497573.html?_fd=jdm&cover=jfs/t1/169776/21/2392/184227/5ffd72d5E34014503/8cb3db23946331cc.jpg&pps=reclike.FO4O605:FOFO003BF3BA653O13O6:FOFO0FF0416O83O3DFO3O643O7FFF5021813FO6O91E3BF3BA652C19C107F50D6D8A",
                "source": "1",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO003BF3BA653O13O6:FOFO0FF0416O83O3DFO3O643O7FFF5021813FO6O91E3BF3BA652C19C107F50D6D8A",
                "rect": "0",
                "c3": "655",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "1",
                "paicon1": "1",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "https://sh.jd.com/g/6j-y5bbXrOj32NwW7Eegqi",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "1",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                }
              },
              {
                "sku": 100005660322,
                "t": "良品铺子迷你香肠碳烤味猪肉类零食肉干肉脯网红零食小吃休闲食品145g",
                "jp": "4090",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/171504/37/20791/210368/608679cbE6ba0ae80/84977a5a9207a6ec.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100005660322$index=9$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=6d2e2b3b27c853287ca91822652f3e4950c79d37",
                "link": "https://item.m.jd.com/product/100005660322.html?_fd=jdm&cover=jfs/t1/171504/37/20791/210368/608679cbE6ba0ae80/84977a5a9207a6ec.jpg&pps=reclike.FO4O605:FOFO0048CD46A23O13O6:FOFO0FF0416O42003EFO3O643O7FFF5021813FO7O1748CD46A22C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0048CD46A23O13O6:FOFO0FF0416O42003EFO3O643O7FFF5021813FO7O1748CD46A22C19C107F50D6D8A",
                "rect": "0",
                "c3": "1592",
                "tips": [],
                "icon": "1",
                "icon1": "1,2",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 2688472,
                "t": "三只松鼠猪肉脯自然片 肉干肉脯休闲零食特产小吃靖江风味150g/袋",
                "jp": "3880",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/173993/14/6640/204574/6087faa4Eb5571e71/0c73f502f820b9a0.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=2688472$index=10$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=21b0aac09949b5f363ab048bd64fdecfb494e931",
                "link": "https://item.m.jd.com/product/2688472.html?_fd=jdm&cover=jfs/t1/173993/14/6640/204574/6087faa4Eb5571e71/0c73f502f820b9a0.jpg&pps=reclike.FO4O605:FOFO4O2905D83O13O6:FOFO0FF0416O42003FFO3O643O7FFF5021813FOBO2905D82C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO4O2905D83O13O6:FOFO0FF0416O42003FFO3O643O7FFF5021813FOBO2905D82C19C107F50D6D8A",
                "rect": "0",
                "c3": "1592",
                "tips": [],
                "icon": "1",
                "icon1": "1,2",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 615036,
                "t": "旁氏(POND'S)洗面奶 亮采净澈系列 米粹润泽洁面乳150g(新老包装随机发货)",
                "jp": "2470",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/172386/40/1448/205775/60655cc5E47f20791/e66166b15a289459.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=615036$index=11$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=10004ef93e415bd21a1fc4e00989dc3d1d5c2bf",
                "link": "https://item.m.jd.com/product/615036.html?_fd=jdm&cover=jfs/t1/172386/40/1448/205775/60655cc5E47f20791/e66166b15a289459.jpg&pps=reclike.FO4O605:FOFO5O9627C3O13O6:FOFO0FF0416O42004FO4O643O7FFF5021813FOCO9627C2C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO5O9627C3O13O6:FOFO0FF0416O42004FO4O643O7FFF5021813FOCO9627C2C19C107F50D6D8A",
                "rect": "0",
                "c3": "1389",
                "tips": [],
                "icon": "1",
                "icon1": "1,2",
                "prom": "0",
                "paicon": "3",
                "paicon1": "3",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10026735529527,
                "t": "打蛋器家用迷你小型手动蛋糕奶油打发器不锈钢鸡蛋清搅拌棒1139 蛋清分离器",
                "jp": "3900",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/153735/1/18988/124869/60334895Ebc877e80/f0e0c6819597abbf.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026735529527$index=12$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=55dbf96e8cadc10c7fb0bf503981377046293e88",
                "link": "https://item.m.jd.com/product/10026735529527.html?_fd=jdm&cover=jfs/t1/153735/1/18988/124869/60334895Ebc877e80/f0e0c6819597abbf.jpg&pps=reclike.FO4O605:FOFO0088026E373O13O6:FOFO0FF0416O43O41FO3O643O7FFF5021813FO6O91E88026E372C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO0088026E373O13O6:FOFO0FF0416O43O41FO3O643O7FFF5021813FO6O91E88026E372C19C107F50D6D8A",
                "rect": "0",
                "c3": "6216",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              },
              {
                "sku": 10026422986085,
                "t": "新中式客厅装饰画中国风沙发背景墙壁挂画大气单幅办公室山水墙画2111 AM101《海纳百川》 140*60尊贵金色(铝合金拉丝边框)",
                "jp": "39800",
                "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/163034/28/3213/174084/600a824fE94cc8e7e/e382510f2c0a6fd5.jpg",
                "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=a2ba71d3c7e2503840b650886c831f77f1e32315$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026422986085$index=13$st=0$adcli=$expid=100$mexpid=$im=$rid=2448457670532708948$ver=1$sig=e55bcb8b56cede0a64d67707ce4911a0de829114",
                "link": "https://item.m.jd.com/product/10026422986085.html?_fd=jdm&cover=jfs/t1/163034/28/3213/174084/600a824fE94cc8e7e/e382510f2c0a6fd5.jpg&pps=reclike.FO4O605:FOFO00756165653O13O6:FOFO0FF0416O43O42FO3O643O7FFF5021813FO6O91E756165652C19C107F50D6D8A",
                "source": "0",
                "sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                "pps": "reclike.FO4O605:FOFO00756165653O13O6:FOFO0FF0416O43O42FO3O643O7FFF5021813FO6O91E756165652C19C107F50D6D8A",
                "rect": "0",
                "c3": "11163",
                "tips": [],
                "icon": "0",
                "icon1": "",
                "prom": "0",
                "paicon": "0",
                "paicon1": "",
                "dpicon": {
                  "icon": "0",
                  "p": "",
                  "count": "0"
                },
                "jpnonshow": "0",
                "wt": "",
                "renl": "",
                "client_exposal_url": "",
                "reserve": "0",
                "presellyd": "",
                "rp": {
                  "source": "3",
                  "ad_sid": "8bba6002-b422-405c-964f-1a6dfee1373d",
                  "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiYTJiYTcxZDNjN2UyNTAzODQwYjY1MDg4NmM4MzFmNzdmMWUzMjMxNSJ9"
                }
              }
            ]}}
          }
          else {
            res = {"data": {"list": [
                  {
                    "sku": 69086918506,
                    "t": "【买一送一】高端灰色牛仔裤男夏季新款韩版潮流修身小脚男裤时尚百搭裤子男春夏男装九分长裤子男 8913深灰（单条） 31码 适合120~130斤",
                    "jp": "9800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/129023/36/7491/400136/5f142b99Eff3410f8/049289b2cc3cf37a.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC82OTA4NjkxODUwNi5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k71jRc3V7ICFJlOOqXlDDVfJ5MSDMdq8ggq3ofBIlNwtWQVQ1ENKEzQve0w2VrGALVSkbutHzWMzHT6VCy_1Pyf0DzCJg9rA19lodtWDtqj2MLq47kepk8JMkTr7wAP3k2V2Nk8_UnQQpkzpDrVoYWAfKPU1Zs2slsr_i9zx3yJpliUP1_OXGNpt83CclbcacctrcfoAUqmhWstoPxlA5lMFkWYWDDaZYoZt6C1ty-kiSnaigbgg762JTXeORbbs5HbLRSbnPZgFR3tw3SqeN80Q7Oc0gVPwEkXusIe0OuIvaRaHhBabRIhYkwBKP-uXdQR_7U76m7v6drfJSmLv_oKOpmSlubJ3n5zUq6VUdZSXwq_djMMuIGDLyb2kTXXs82tF1h4Mylh8naBgRrt8sT7g_5jPZUVgWXtahYSiJHB0OJ3cFxxu0NmY-5GC_IQUfnyXM5UGvBc9MX32_dSSoq9pgWhTzcJy8xbly2yWqMW1dmpCkROjTWYednLiLmiSDb_Ys5U4oHoh85AX6CTLJHGhd1vmPpdvLBLMjwlhKq0XPRmiMltUbxiQFcEdLkX-HE-k1uFi7KuBQWpoHmRGt_9LN8sAa1vvN37Xmx2FmYa_FUWwp7lJjh71A0hh9bU3Lk3kXGFJCMdzsD5dRKW6W5q_N4MGNJei5hyeF4M7VHB3hn8Yvjc3-svy34B9D8xp-4kYbW9eRMS46ojDbSQw8Fq9XHZVoc34mgUipp7PFqrBXt7jLh1YZSQo-UBa6oIvT4Q_5tA_F7i1EiWZ4x083RvoEnaquP1kN45PuXe9iqlcXoJQY6xyDkT3f_4U3ttOj4GAmzhq5mOHKcmE4ag914zntq3NOEkyCvgLURkVIXfQw&v=404",
                    "link": "https://item.m.jd.com/product/69086918506.html?_fd=jdm&cover=jfs/t1/129023/36/7491/400136/5f142b99Eff3410f8/049289b2cc3cf37a.jpg&pps=reclike.FO4O605:FOFO0015E6B76A3O13O6:FOFO0FF0416O84O1FO3O643O7FFF5021813FO7O1015E6B76A1D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO0015E6B76A3O13O6:FOFO0FF0416O84O1FO3O643O7FFF5021813FO7O1015E6B76A1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "9735",
                    "tips": [],
                    "icon": "4",
                    "icon1": "4",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/2xMFC4HQgTueG4omlIcGJJ",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 100013430692,
                    "t": "vivo TWS Neo真无线耳机 星际蓝 无线游戏运动蓝牙通话降噪耳机vivo手机twsneox50iqoo安卓苹果手机通用",
                    "jp": "49900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/129721/17/1107/126026/5ed5bc2bE083f7c4b/09d7bc74ede708b1.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100013430692$index=0$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=b4ad8acc71504b0f52ecd1e60bb2815609555cb1",
                    "link": "https://item.m.jd.com/product/100013430692.html?_fd=jdm&cover=jfs/t1/129721/17/1107/126026/5ed5bc2bE083f7c4b/09d7bc74ede708b1.jpg&pps=reclike.FO4O605:FOFO004943D7A43O13O6:FOFO0FF0416O423O2FO3O643O7FFF5021813FO7O174943D7A41D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO004943D7A43O13O6:FOFO0FF0416O423O2FO3O643O7FFF5021813FO7O174943D7A41D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "842",
                    "tips": [
                      {
                        "t": 102,
                        "v": "您浏览的商品推荐"
                      }
                    ],
                    "icon": "1",
                    "icon1": "1,2",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYzIiwiY3NfdXNlciI6IjIiLCJleHBpZCI6IjEwMCIsInJlcXNpZyI6IjcyYjI0Y2ZiMDQ0YWVmZWRmZGJhMzYyOWU4M2RjNTY3ZjZlNWQ2OTIifQ=="
                    }
                  },
                  {
                    "sku": 40906656479,
                    "t": "乔丹旗舰男鞋休闲运动鞋男 春夏季新款轻质网面透气减震旅游跑步鞋 黑色/闪亮橘 42",
                    "jp": "15900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/100542/30/18338/71286/5e93db5fE6870ead9/c932bab2cae9b964.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC80MDkwNjY1NjQ3OS5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k46AdWBysyne4HSbG1lNflubGFSNTrpWFDtQCtvswIXomOEKLnraxsckhKTLPNgniktmck14itXdMqUq2-cFj4wonB14kIlxKYktVwBrqhT6JGQdvT4MpghXuq69GuORJs89evh3o886B_WR7qZWLu3fjWHKKaqv0MIH9o8aJT6Dlpk3Fn-JTeG5AXwj7LCNXwQpTMJRSM8MFcRpQZTmCMngX6rOLEKB4rVSKpliez1tB39sEZg4A_XIZoFy8UT7d5ibnvx8tgvxYxN2dsP2JlkZSEDg3He10FAnInAZEBUNIFVfdajeR0JRyIvgeDzN3ted-S3xanBPIs1oIToAiTTfU9HiKDm9yvsyt0Kp0e_mlrb3S-QsJURe5l8FGvDYTp6-wK3bylf7SGo4p-99wB18zxhEyUpZMf5BtMcuSC2pHzMI6ofvxeOsQFRJ-Bq1YAnA7D8aUFQ3_mQpDSPGUljuVtS17IqbIvxtSJORtYHFoY7bXGLqizW-ej9_xeYWs-_MjmZmo70UQxAMf1pqn5vCXHTyJBdwj91Qi9lJRZbRkRSu93Gv0Rw4qEMROjw8W-efRaH1C2RqlrMjqe_MP8Uq_y36SyVKmsPwfFZneOElLlytjtGrE6OT5GxIhPfO9e-UesoBIb2vmA5RoNXTPIMsoJkanNL2lqbCZFrB8_f6SHBMxH3ydgFdzLs0DdVjed6dshbEsra_rixscUNXxaIKl6sLcRV15VSPrWK6JXaSzJV6Fe0S-hM1okk2V3o8n2HEJlUmduWQb_1rXzYUSung4H9VvFYVudlsDNCo1bmrNFquQpxL1E4HFoeMgv-dM8Pq68Z9KN9EBZW9PMd45gK9ZOELIG3jC3h8iDl67Wp_ujTMU8JKjOM9JzIAnKUTYw&v=404",
                    "link": "https://item.m.jd.com/product/40906656479.html?_fd=jdm&cover=jfs/t1/100542/30/18338/71286/5e93db5fE6870ead9/c932bab2cae9b964.jpg&pps=reclike.FO4O605:FOFO00863A0ADF3O13O6:FOFO0FF0416O84O3FO3O643O7FFF5021813FO8O9863A0ADF1D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00863A0ADF3O13O6:FOFO0FF0416O84O3FO3O643O7FFF5021813FO8O9863A0ADF1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "9756",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/1SpRc6n1KQG7kgPVHKuV5L",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 100020397224,
                    "t": "一加 OnePlus 9R 5G旗舰120Hz 柔性屏8GB+128GB 蓝屿 骁龙870 65W快充  专业游戏配置 超大广角拍照手机",
                    "jp": "299900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/162460/3/18389/64294/6076cd05Ece25fe7c/3d1eb3a9e829d5e0.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100020397224$index=1$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=13d5369bf3efb1f62ff12f58899d5960a17cb3d4",
                    "link": "https://item.m.jd.com/product/100020397224.html?_fd=jdm&cover=jfs/t1/162460/3/18389/64294/6076cd05Ece25fe7c/3d1eb3a9e829d5e0.jpg&pps=reclike.FO4O605:FOFO0049AE24A83O13O6:FOFO0FF0416O443O4FO3O643O7FFF5021813FO7O1749AE24A81D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO0049AE24A83O13O6:FOFO0FF0416O443O4FO3O643O7FFF5021813FO7O1749AE24A81D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "655",
                    "tips": [
                      {
                        "t": 102,
                        "v": "您浏览的商品推荐"
                      }
                    ],
                    "icon": "2",
                    "icon1": "2",
                    "prom": "0",
                    "paicon": "4",
                    "paicon1": "4",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjEwIiwiY3NfdXNlciI6IjIiLCJleHBpZCI6IjEwMCIsInJlcXNpZyI6IjcyYjI0Y2ZiMDQ0YWVmZWRmZGJhMzYyOWU4M2RjNTY3ZjZlNWQ2OTIifQ=="
                    }
                  },
                  {
                    "sku": 29733176394,
                    "t": "尼尔卡登（NeilCarden）皮带真皮光面头层牛皮不锈钢自动扣休闲裤带正品男士腰带420 黑色金扣",
                    "jp": "39800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/77773/35/5334/133185/5d37c0ecE0c3ba46e/5799af63dc41f559.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8yOTczMzE3NjM5NC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k6eRU1N-Q0xysbhPtUJsZ1F1cMGxgOuAlchOi_TNl45e83cAtohMPfVkUAqGcmGOvz2zkB4Cyhqsx8xXb1OsED5_fw3LUJ94Faosgja1p0SucNUq9iaaOT-OsldkgyHnefh4G3TmeP5IUQMdl7P-f30bi-bqOyHJ6IdCd4K-M6j_NQ4zRs581Yl38Bwg_78PPECCf4jZa4R1QqzK09JQFrn37BinDTFDFBzC-Dq-Jrd1oYzXESDM-xX7TdcD66DXm0uOJ8onBJkNpj77kaDp2lxHQj8g0nX-EJfGJKQczxu193gwgKpGIs2i00iUP56wPYMaCyjzELSh5Dqfy9fbFuC9cfWcg4U9CaEpOLBMJucYVd8pqoZR2rA6SDRtlqp3xmncCivon1nNg57nkq0cTR1XdZisicbFANSiyiqoRBMHOVkF_G6QkR4ip9LY2zzzIjTrdA8cw4kjy1TJGdGnwrQYJAexWsk2tsFRSX1U1YYJrJhSZemNfOQt3pBs4vfg4OrUQJA-48vQI-PpGIdOnEpXspKacgMuDAF-5NJNOARwJ8I3Bf302GjA4f-00nKfLnawO80uuVAdQGKG-3shky-LAgh8kmSmMJbarc_wCQT6SMcFm0kdRz_5QxeRQtVN_0Or7V-mXUmmYmIuERJhr4jMFx5IMPCY3kyBTOXLvj4FFEZEoAD9rDmEOYfIGZPYf6kx78HSh5QeW32CIMv4x49m3k0OxfmEFwjlLX_V4HzhqiB5myfc68CZv-AyAtftvNcUAZNyoEYIlayDAecrEMEhejOq75yyrP7nX1b28OCs-8vJFnOIk3ariQSYHZmDgeJJo8lWth-WUysLgGgGrYhd5T3j5tmfY_9V-I3lR0TyA&v=404",
                    "link": "https://item.m.jd.com/product/29733176394.html?_fd=jdm&cover=jfs/t1/77773/35/5334/133185/5d37c0ecE0c3ba46e/5799af63dc41f559.jpg&pps=reclike.FO4O605:FOFO00EC3C444A3O13O6:FOFO0FF0416O84O5FO3O643O7FFF5021813FO8O6EC3C444A1D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00EC3C444A3O13O6:FOFO0FF0416O84O5FO3O643O7FFF5021813FO8O6EC3C444A1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "12029",
                    "tips": [],
                    "icon": "4",
                    "icon1": "4",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/7efptFAm9FhfMbFwab6OeQ",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 10025450214903,
                    "t": "倍量 7号电池 一次性碳性干电池1.5V七号 适用于儿童玩具/遥控器/鼠标/话筒/闹钟/血压仪/挂钟",
                    "jp": "1490",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/139345/19/16659/121529/5fc73e71E9598d7ff/489c09d0c645d3f6.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10025450214903$index=2$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=5780e25f003d7f1e31c96ddab2751a30e4f8a1ac",
                    "link": "https://item.m.jd.com/product/10025450214903.html?_fd=jdm&cover=jfs/t1/139345/19/16659/121529/5fc73e71E9598d7ff/489c09d0c645d3f6.jpg&pps=reclike.FO4O605:FOFO003B6615F73O13O6:FOFO0FF0416O44O6FO3O643O7FFF5021813FO6O91E3B6615F71D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO003B6615F73O13O6:FOFO0FF0416O44O6FO3O643O7FFF5021813FO6O91E3B6615F71D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "854",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 100015573448,
                    "t": "稻草人男鞋休闲鞋男士牛皮鞋男套脚懒人板鞋子男韩版潮流轻质舒适平底 D960 黑色 42",
                    "jp": "21800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/171994/40/5/137654/6059a5b6E352fae8c/8e0874deefde934a.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAwMTU1NzM0NDguaHRtbA&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k56Qyue81XPnSaAjEWcm84Z65OATV8nFphazGMlWwY-TJXYy1gipIu_wZ0inoeDSjLgf3_qIuvYOt2GXyZY7Pexm-R5Tg91xkDxUVmkht3BU5SWHxm0v1_Yt9mLpr8hvjmOgzWM_N-3KA3oQbd2ohg6YR_RUYlScNCr2HByEZ_TX7omB-YO51_DNgBE0PJZoC6JEeCBdzYRMp9qQE_iLXK0tqqEloCWAJxcRghNJTr3u5lbyApWkhsZjMY2uGHlrR2q7ymH6gkB9m0niaYgWxeWwor9RNZOYVhilbKieWqKIYyH4kds-YWdd9bI_suLd_8DYHSbKt9d2FcFljS20zQb_hzELwlH58jG2rg7CnhGrNKTWcYTlaUGZOUejJKEVMlfc2PJ9rQ6-DoM-HYFpSh8KmuAd76eRm7Fdf7NF_SUW04j0jsAkLtTtKg1uf5h17TBkJYoEHYOWdU8bkuxraEiMEDbBvc6TGgTEhLMvthbkkjUyPW2GNiLZa6G2vnHwyNc654VKlRV1BxvPqPx8vMss_I5CCmIE19MFVyj8atYRgBt5PTys256ID74RjvGACNQKhciIkMcLU4wqGfRwdGzLnCG4rbFR7FVLrEhe-88ahIx95Bvt1QZ9kFlEH3Z7FAprqvJ0SCUVymiARVrk64cIjCRpfcEQWY-bSUFQBRThn9ouMTeLDpX5mWHNg-k5OMhhYtHZy2w2K-ZPEIxSuvVzIrvGJx1xZeFsztgtWUd3JhzNiuds74rA3PnqszoPwtUakxgdXY0S6iiFLbE6WAM5wXrYQYpDUpLn9ioz5vVYAUbVR2kbWNNlSFazjnwYnjVWMnqFd3uZeK-YoMmfbe7yG7MkLYvdoySeNpdHOFUz8hxK2nksv7nxuTW0B06y7k&v=404",
                    "link": "https://item.m.jd.com/product/100015573448.html?_fd=jdm&cover=jfs/t1/171994/40/5/137654/6059a5b6E352fae8c/8e0874deefde934a.jpg&pps=reclike.FO4O605:FOFO00496489C83O13O6:FOFO0FF0416O843O7FO3O643O7FFF5021813FO7O17496489C81D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00496489C83O13O6:FOFO0FF0416O843O7FO3O643O7FFF5021813FO7O17496489C81D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "6908",
                    "tips": [],
                    "icon": "2",
                    "icon1": "2",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "2",
                      "p": "20700",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/cstUPZLhRqw1AOPekXG_pW",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 64421715300,
                    "t": "心家宜 无痕衣架 衣帽架 家用卧室挂衣架 防滑衣服挂架衣撑防肩角大衣架宽肩 混色随机发 10个装",
                    "jp": "1200",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/92770/37/7990/268713/5e002bc3E3ab3f8f4/a10376be632e2590.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=64421715300$index=3$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=c12e496f7fb590a505c0652d087694344333a72d",
                    "link": "https://item.m.jd.com/product/64421715300.html?_fd=jdm&cover=jfs/t1/92770/37/7990/268713/5e002bc3E3ab3f8f4/a10376be632e2590.jpg&pps=reclike.FO4O605:FOFO00FFD55D643O13O6:FOFO0FF0416O44O8FO3O643O7FFF5021813FO8OEFFD55D641D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00FFD55D643O13O6:FOFO0FF0416O44O8FO3O643O7FFF5021813FO8OEFFD55D641D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "17078",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10024717448364,
                    "t": "雨逸Q弹丨361 男鞋夏季网孔透气软弹运动鞋男防水跑步鞋 曜石黑/碧绿色（门店同款） 41",
                    "jp": "16900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/155830/12/10362/189010/6030ae38Ef00d6430/4f4243900c0286b3.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNDcxNzQ0ODM2NC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k5D0ViP-ehz1Kg3b0_FEszbT4-kd34GtPXVdZPoc7a_wwv5SmmbsZZh72_eMsOTL7P35MWuSLW4NIE96SPIEB5DEsts0r9ppnVTruEW-zQpKuAaYee8CSvl3zDqJIcCBNAeJpD0yg_2Isc785XiY2TcHdNgdNwdWk4S0p9TgIZx5-iWCMNJZF-Vb_Reci0Tcz-dMWNV0FXG7YX0Q5xiOb551oBvuzSHIH_b1IU41MAhsZG5RYM6B3BS0aejn-1py7jlRaeV_gzYkE1WyWfYR-JH4pn6PqPmOA-bUb9UNz0PpxPO5HEu7-QJ3jFZeIdJ7B3bOb-Q9mY-T07d3Pe_2g8ctCGSINkbfSsMFsnZ9S8SgLX7iDqEfJyrNTJIIq3mVWmgrFhvZSTEQ7nqyhCF-DWVIHYbydvYj2aMOAcP-Vr-Q0AUOBKp7e2mv_oGx0J-gyP76GltQUCLrwMU8JimH3bIjqcmkl5FDhIfe7WtGfwFJnNzjjNkt6-wyyFtuUBNDL1Rfe99bo8S20zGtet2yrgMs728xVoh8B-Q3mea_5t_uyxi-IQSqml0VKM0wo-oPQTXCgqDJ3FmRyWTOGJDjbxwF_oc68ba9Fqtl_oguT_AduLa0UmYskPCq6-6XG8ZCH6Shd38IqcVWb3sWvSe9SGwqRFAfMRCNfyJ5p7lIBPLHqlqFyY_1WLl_3zk4Yj3TsegT0Xsfvyi-WWEvXPAkAvc0qv5JwFYm1YfNBMDlLY8DEYBsj9xStQhgImQ9MVuTnomS770qIwSUQw24zmYRjhjV8-yZj161xrpoMkOXwesh6XGZQhTzwndLuCUfcBvyHGfo4HuE6esUwvBV4Gid3hg6m1gS8y3iyCRRwW-PL2u23TNcG5FFCWQfVlKvVYbqL3SdaEgQGXx4LpqEJmmPN3lAivzLtOZeewev8Z9DR1GhQ&v=404",
                    "link": "https://item.m.jd.com/product/10024717448364.html?_fd=jdm&cover=jfs/t1/155830/12/10362/189010/6030ae38Ef00d6430/4f4243900c0286b3.jpg&pps=reclike.FO4O605:FOFO3OFB8F4AC3O13O6:FOFO0FF0416O84O9FO3O643O7FFF5021813FO6O91E0FB8F4AC1D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO3OFB8F4AC3O13O6:FOFO0FF0416O84O9FO3O643O7FFF5021813FO6O91E0FB8F4AC1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "9756",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/4ftwen7JPVt30GQT-VXPTV",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 4544060,
                    "t": "良品铺子手撕面包1050g 2.1斤早餐小面包饼干蛋糕休闲零食办公室糕点点心整箱装礼盒",
                    "jp": "3290",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/186964/30/154/218014/60869088E24cd2039/3ed83ae117c4b393.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=4544060$index=4$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=3a17babd660f120c6308d0b0d2996ae49d20aee9",
                    "link": "https://item.m.jd.com/product/4544060.html?_fd=jdm&cover=jfs/t1/186964/30/154/218014/60869088E24cd2039/3ed83ae117c4b393.jpg&pps=reclike.FO4O605:FOFO4O45563C3O13O6:FOFO0FF0416O423OAFO3O643O7FFF5021813FOBO45563C1D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO4O45563C3O13O6:FOFO0FF0416O423OAFO3O643O7FFF5021813FOBO45563C1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "1595",
                    "tips": [],
                    "icon": "1",
                    "icon1": "1,2",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 11292043040,
                    "t": "宾色短袖t恤男圆领夏季薄款棉欧美简约体恤夏装短袖男修身型印花男士t恤青年纯黑打底 黑色 XL",
                    "jp": "6900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/95308/16/15715/111979/5e74fc1fE4c2b1c5c/5d9a51a8afa721d9.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMTI5MjA0MzA0MC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4wtK4hNNEszpgtk0glDSnqiIRZFi_beQU3V_Zz13deLTk5MJjWoYT7d_drc2SHKpK8TAy1sZhLvrjWifijELIm_gmrQ43qtn7I4jtjFCkX4OcvnKPsce8DkD4l-s0D9z3OtT0OqksUSyPbvizrd6563K5G3bGHgmdtSuIet7SDL27qQFIlBM015UX7w3hDobnHxFuQcnkQlZKGPkzw3KPoqmd8iOYWlGTFozPGWqwzqVeegABC1LLT0WNZn4rbL-4k4RvJeVtrmeWv2QxoKij_wGqJIgTBVQpzOgWBijsh3RZvpfS1ZlEq89YnUp_b5CzyrlR8Z9fPShx78n5egGW4lfyWuXseldenaZPkfrrF3IOsBOKGGbyfESTfVF868P_Zwvc50Zcg7rMFAGzW5MN4QuOlxDG_YxTfIYaxGOqwwJ8NyMOByryjCgs0Udp9Zjh0UkDev7lVjSUojQRYd1LFYQ4848x_vkbgSNtragUa4f5fPnfset1stxRkCAF8aG_1pFVc_KWQnLPCSDXzbsW4YZp5jB6gCr9g4zCt8BcY1tr1YzCXYpjxdOM4x69UirwS2gcZmMlH14wyspCa1ffFgOsNxARU5wdG043WIGNjKrvPHsEIHXbXdmS3ScafaroWhp-mJKQL1p6xTPHSsCjaqZ5YAryjF869B8iggoJJ3BD4Dkua-XD8QnL02h6fCyIK6kMPt2uAjDgiPp3M4MV6EsJ3UXij5hC1IA4QE-4epGI9sBbfuhspN4L4TYO8wkn7okrUDvxxn-k1t3LYunwQMfrrYJoYN7hVOpXJhN9Qa-_OUsgSYA6gYG2eGd1SivKgkgzX3UbJ0lwqAqZkLYyh_uiZI18veUrFFMjZsMJAVm1ubmgaE8qG3hWN-_RMld8&v=404",
                    "link": "https://item.m.jd.com/product/11292043040.html?_fd=jdm&cover=jfs/t1/95308/16/15715/111979/5e74fc1fE4c2b1c5c/5d9a51a8afa721d9.jpg&pps=reclike.FO4O605:FOFO00A10EE724O13O6:FOFO0FF0416O84OBFO3O643O7FFF5021813FO8O2A10EE7201D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00A10EE724O13O6:FOFO0FF0416O84OBFO3O643O7FFF5021813FO8O2A10EE7201D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "1349",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/51TbL7PD_wU2qyPGFNQLiF",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 68242777298,
                    "t": "自动大雨伞s长柄抗风德国大号双人三人女超大号双层防风男士晴雨3646 120CM酒红单层2人",
                    "jp": "12800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/116901/4/1787/85801/5e9b1c68E02cb3824/c060c316252807fd.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=68242777298$index=5$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=800ed93d563f4771092b55408741170d3c40c13c",
                    "link": "https://item.m.jd.com/product/68242777298.html?_fd=jdm&cover=jfs/t1/116901/4/1787/85801/5e9b1c68E02cb3824/c060c316252807fd.jpg&pps=reclike.FO4O605:FOFO00E39624D23O13O6:FOFO0FF0416O44OCFO3O643O7FFF5021813FO8OFE39624D21D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00E39624D23O13O6:FOFO0FF0416O44OCFO3O643O7FFF5021813FO8OFE39624D21D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "1656",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10610621029,
                    "t": "卓浴卫浴混水阀明装淋浴龙头加厚冷热浴室水龙头卫生间热水器阀门混合阀",
                    "jp": "5600",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t5731/269/4570730088/192743/bb607f27/5950a802Na1d3bfb5.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDYxMDYyMTAyOS5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4PuguvniFTzqxHzXLcGiac27IATQjNdzwHCVJJl2ZSlh_dKRpuyfCGyhveunhl48YLPHa4GAjzPrgWuh4u1QWNXC7mkJG_TKFWvqUBZCh3paLA5jpRQVoyGHMlR1Wz7SkXiFcU4ju_-48aLyUMfGAf7XJesgMVfm3ZvF_8FSNF8u2QWgictIb_dLFjS9oPv1Jbm1petLE0CMWd3Cp65JoBPn4Og7UTicIczHkfol2M-ct1p63AzKqLFFDDC9DkRsqAiF5U2EuvQrI6e4kP81ISHj3SHLjDYLDPPfZanUZUoBrWgWokMS54BT0LUMUCbOO8lzfnxKLFvsSGQA_5O9zCOsvaMNzJUnYKcbiHBbrLNN17Nq9-mdDZkeh8mS8qADiJEf_5U8FKTP_5nVUSz-99V7IE-zKzgr_8asYCrJr_386nFwFoPctQ_7oO-8bRAVgJz7xIN1X9rwZkaOvZ2s9jQESJImUUdo6uX-ssw0sZmQKiQscJDgOC6K1qhiGHldWwgjTOku-pZl8xELlapA6ys3uS7DJmRb-tJyP5DmtMAvCWfJG5a12D4FeNhQdh0aC3CBgsdGNFm-3-emyOHgUfz8QDhNuMI0tN5MDKFlYpb8pi2ZgNB4adDWh0leMzVEdV9HS5rQS08eMoBdKXRpE-b7sDMPqKn7y48k-HsQLT6DEJSOiX4KVj6WeadjrGMONhgSAn3bAB8YgQeM5Z3jWcO-unGdr3lKyjZOhrI1DWU41utEswrEhiOdscViDLPrcAF1TsoDlRhskR9SqLD6wNn3PfckN2G2E2cWFX8jJZ7mkXCbmCShIlDeBIxhBMuo0afrJC581_m7qNiXJHS5OjN5h8u2kYFtNtAS1o4Lo1lA&v=404",
                    "link": "https://item.m.jd.com/product/10610621029.html?_fd=jdm&cover=jfs/t5731/269/4570730088/192743/bb607f27/5950a802Na1d3bfb5.jpg&pps=reclike.FO4O605:FOFO0078713A653O13O6:FOFO0FF0416O823ODFO3O643O7FFF5021813FO8O278713A651D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO0078713A653O13O6:FOFO0FF0416O823ODFO3O643O7FFF5021813FO8O278713A651D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "9909",
                    "tips": [],
                    "icon": "1",
                    "icon1": "1,4",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/0I-awI6BBmk2L_-RjpqEPV",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 10026735553731,
                    "t": "板栗开口器剥栗子剥生板栗夹子开壳神器去皮工具家用十字划口机1118 304不锈钢板栗开口器",
                    "jp": "4100",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/166391/38/7668/151936/603348b1Ee5f3d04f/1098f6242144d839.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026735553731$index=6$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=daa3b8b3c000e63086ab088c1173e58eb5d06cab",
                    "link": "https://item.m.jd.com/product/10026735553731.html?_fd=jdm&cover=jfs/t1/166391/38/7668/151936/603348b1Ee5f3d04f/1098f6242144d839.jpg&pps=reclike.FO4O605:FOFO008802CCC33O13O6:FOFO0FF0416O44OEFO3O643O7FFF5021813FO6O91E8802CCC31D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO008802CCC33O13O6:FOFO0FF0416O44OEFO3O643O7FFF5021813FO6O91E8802CCC31D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "11978",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10027496789213,
                    "t": "AIMAKISS潮牌厚底网面老爹女鞋2021新款春夏季单鞋百搭内增高运动ins潮鞋休闲鞋 粉色 37",
                    "jp": "49800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/159782/15/12039/295698/60477731Ea1c19703/490edde24c417e32.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8xMDAyNzQ5Njc4OTIxMy5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k4Gj603j9vKSMqecRPMFDahhhyeA0tsbprn-M-k5PYxmt1QvLpGYOfAJqQcuw2EN1vqcLH8FIwRsnIPf7gAM1F0ASKoy3HdZ-SOpI_G6IoN9FFuCCNvP2UEt6KoqsYC_3L9DaTktCwTRcLCoXql2ZmbzsJaahaS2O-0s9r5WRHZKrUrU_Xv4EPXAPKAGGb_tnWiJ5JvIUCz1YMfN30Bg8eIX1falMczvacd7eFW-d0qtXy-tCHgACqsR1SJlNIBuRFkbuGYvhd2LsI5zBvv9fvJOKaPEDyVUzgYzLpEXAejfisaHNxjxqyk64olfUfkvjkQpN2F2iLOcAxsI_6ch29y3HVJ1gYI3HquGhQHWnHYBqV_duON3JkrpTT294UQfAGx33xRuuU3aQRwZakb6RzDDHfK5OAEkicsI2_WLAW0N6yDCSmymvHTtliuvdCxiXx96xy3wW9UsfVbsItZR2E_y_LpYaFoe9LMPYu83ZFki2449O0QLqUnbyIAozhQEU8cwxz01uChdwtNCZsQcDym66y1teU0kqmeigRr72NYH-_Fx38IHBQZjUXVzTOGojBeyDoAr0OvHWK1QMrnwpWyZUbbQ3f3WaPlx9Xajk6IcYAyjoueXBXmtKBzW97t4LojHf0_c1FKrY21OVE_BWE6-qkMyeOfHLAZwFlbCYlOwqP-ALwA_yvDtbOyOmPLBiA2vMrpEy1NojAyrJvpa4eqIxq3PuOeh778hreakAcsxAHS_8m0Ka8K1mBGnKEEN-Dd9IZXut5OzF-7TZ0hCKPGx6XzrOobGqSddBXbn0I1bWDr8NZYPhDQAVmdCsuHk68VVJh51GQ-jAe51YvgX_pxRkATEkPM3ben55Wc3niLklEOwJlGk2VV5-csCJkoZgk&v=404",
                    "link": "https://item.m.jd.com/product/10027496789213.html?_fd=jdm&cover=jfs/t1/159782/15/12039/295698/60477731Ea1c19703/490edde24c417e32.jpg&pps=reclike.FO4O605:FOFO00B56254DD3O13O6:FOFO0FF0416O84OFFO3O643O7FFF5021813FO6O91EB56254DD1D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00B56254DD3O13O6:FOFO0FF0416O84OFFO3O643O7FFF5021813FO6O91EB56254DD1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "6916",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/1w2cxuCOnak7lpG_1hMz3Y",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 10026741028993,
                    "t": "红酒醒酒器套装水晶家用欧式个性创意奢华高档快速1000ml分酒器壶6869 强化水晶 带把醒酒器 1500ml",
                    "jp": "8700",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741028993$index=7$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=6db6cd22b3a81ec0ef1207cf63ba5690c36da4bd",
                    "link": "https://item.m.jd.com/product/10026741028993.html?_fd=jdm&cover=jfs/t1/165053/33/7413/274327/60335ff6E0c71badf/f9cb8a1161932f49.jpg&pps=reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O1FO4O643O7FFF5021813FO6O91E885658811D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00885658813O13O6:FOFO0FF0416O43O1FO4O643O7FFF5021813FO6O91E885658811D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "6225",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 25512318288,
                    "t": "花花公子 长袖衬衫男 中青年2020秋季新款撞色格子翻领宽松衬衣 商务休闲时尚免烫男士上衣衬衫 127蓝色 170(建议120-135斤)",
                    "jp": "13900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t21766/170/1523439135/328642/e8e73cd4/5b2b5ce8N50ae127a.jpg",
                    "clk": "https://ccc-x.jd.com/dsp/nc?ext=aHR0cDovL2l0ZW0ubS5qZC5jb20vcHJvZHVjdC8yNTUxMjMxODI4OC5odG1s&log=eKy-C9_e7AHHI0o0_6c4XeMbS5sGWDw9WEpz2Gab1k5NEIFzKo-1SMtN6NrbK7rPJjfLWyNbhEhwJb1R7DL2_qj8L9vER7yDgmNyOQBzql9dqvPEY7RCqV7J8xwHVVbJXBLUJxbSPs7uxmUxWMS8gY5xj0_2VJd65rWGJ8J49s2O4H-HjP_Ui7StmAzZZSmmF_ipAjs7Mi9Q_Y_Ye48kdsSOm7YLYSRXol_9s65mKA_CDPm3fejym0e0z2i8a5k9CsIAs4pIl5NIMeet9U4zU5dPfmJmp2hZFFfvueXdkSzbgRlas5_FZpU5dY5ojXgbtNSCVbKwX5Rgrn0OFx8DjGfxx9JsIsApRXXpwtoqUuoRO5w2TwE9R5zjPSMBS8MuZxtSwwbIqTmkFYzpUyZogpGZyE9GW8NKXfTZPBYm_pTn7phF2FbG9A0HD588M3B0jAriFwPpP1THfq9tH4YSCpurNSljXRKKD2PZkIw5ySy-UtQzyusfiTO9_yvQiJvECXmRg3hgqcUe6w2g3d8GyX7KMsAfVf5nS0DGwLi0L7jVaQS-cOQNAjY4AVJzug7nUJriymGx227hoShq51ZynpfhoAd-jcksq_sPZB16YFahVH8MFzkMWqXf6gYoSJQI9nfAE7HraBdxjPpFmVgeUwqV23cVeKz36-1v3DA7riXlEOu8aN7scYDGdhfp2mcH-vju5dCLu3v3snn_gGOZ2yOpeQTRHEWrVzEsxcYfjuaMHvh4wF_FICkzwfHudhPHSha7Ns6ETWTP4qDytxXm6msTQS0RV5_z0N__z9JYMJkQL63kSYj87dZAblqDqEE1jS3yWvRrq4_NsMPX5MqwCCIhwnOjEIIsltXYrvo52eM5PzrScXQQffji10JXm5U012AvDYEu1ZTvPhMReyQSr2DiMk6C14XVPuP5yHQdofUZu_dgCzm-82h4bkE8SF6JqZgh00E6KMUrDxfEp50ZFeknbjdXSJP7ZyYMejrizutqf2osCy-vhEHGxLIH4CrkXw102URnasOLDhG6DJ0mCcX9H0v-FhFSX_OuCoNDWYA&v=404",
                    "link": "https://item.m.jd.com/product/25512318288.html?_fd=jdm&cover=jfs/t21766/170/1523439135/328642/e8e73cd4/5b2b5ce8N50ae127a.jpg&pps=reclike.FO4O605:FOFO00F0A71554O13O6:FOFO0FF0416O83O11FO3O643O7FFF5021813FO8O5F0A715501D91C0F6FB10078E",
                    "source": "1",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00F0A71554O13O6:FOFO0FF0416O83O11FO3O643O7FFF5021813FO8O5F0A715501D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "1348",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "https://sh.jd.com/g/ahhCkQVgNkEa5mosxCX3Ed",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "1",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJyZXF1ZXN0X2lkIjoiIiwicGFsYW50aXJfZXhwaWRzIjoiIn0="
                    }
                  },
                  {
                    "sku": 100000253890,
                    "t": "小米路由器4C(白色) 300M无线速率 智能家用路由器 安全稳定 WiFi无线穿墙 工业级",
                    "jp": "5900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/64656/9/8204/129172/5d5fca63E6fbea57f/26e87c16af99b884.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100000253890$index=8$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=47852c94dff0e22b233737f2aa57fc2699271c8a",
                    "link": "https://item.m.jd.com/product/100000253890.html?_fd=jdm&cover=jfs/t1/64656/9/8204/129172/5d5fca63E6fbea57f/26e87c16af99b884.jpg&pps=reclike.FO4O605:FOFO00487AC7C23O13O6:FOFO0FF0416O440012FO3O643O7FFF5021813FO7O17487AC7C21D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO00487AC7C23O13O6:FOFO0FF0416O440012FO3O643O7FFF5021813FO7O17487AC7C21D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "700",
                    "tips": [],
                    "icon": "2",
                    "icon1": "2",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10026741026892,
                    "t": "爵杯帝王杯玻璃创意小号白酒杯套装2两个性家用水晶中式仿古酒樽3301 帝王爵杯-10ml-6只",
                    "jp": "10800",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026741026892$index=9$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=af3bdae91f5a67ddce44d80ca6a7583758ddad92",
                    "link": "https://item.m.jd.com/product/10026741026892.html?_fd=jdm&cover=jfs/t1/168239/35/7403/135360/6033600cEf76c1d8a/781f3bcc3dec0e4b.jpg&pps=reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O13FO3O643O7FFF5021813FO6O91E8856504C1D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO008856504C3O13O6:FOFO0FF0416O43O13FO3O643O7FFF5021813FO6O91E8856504C1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "6225",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10269776770,
                    "t": "索尔诺置物架层架收纳架家用搁物架台面家用浴室客厅办公桌上整理架子Z613 z613【宽42cm*高55cm】",
                    "jp": "1200",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10269776770$index=10$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=bd61fbe7f06419f1645e7283f056f084870f28b3",
                    "link": "https://item.m.jd.com/product/10269776770.html?_fd=jdm&cover=jfs/t1/184998/16/1011/285942/6086a78cEaca005bf/3fe355e37a476b50.jpg&pps=reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O14FO3O643O7FFF5021813FO8O264205B821D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO0064205B823O13O6:FOFO0FF0416O43O14FO3O643O7FFF5021813FO8O264205B821D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "9888",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 10026775369311,
                    "t": "珐琅彩水晶红酒杯套装家用葡萄酒高脚杯醒酒器大号礼盒装定制刻字6579 金色麦穗水钻酒杯(一对礼盒装)",
                    "jp": "18400",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/164413/24/7520/177119/60349d48Eb9195ebe/afd9a079c84547bc.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=10026775369311$index=12$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=4e036313de3810d1ea444f8eaf39f55150b18b12",
                    "link": "https://item.m.jd.com/product/10026775369311.html?_fd=jdm&cover=jfs/t1/164413/24/7520/177119/60349d48Eb9195ebe/afd9a079c84547bc.jpg&pps=reclike.FO4O605:FOFO008A62565F3O13O6:FOFO0FF0416O43O15FO3O643O7FFF5021813FO6O91E8A62565F1D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO008A62565F3O13O6:FOFO0FF0416O43O15FO3O643O7FFF5021813FO6O91E8A62565F1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "6225",
                    "tips": [],
                    "icon": "0",
                    "icon1": "",
                    "prom": "0",
                    "paicon": "0",
                    "paicon1": "",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  },
                  {
                    "sku": 100003174940,
                    "t": "JMsolution肌司研水光针剂急救面膜 35g*10片（JM面膜  韩国原装进口 补水保湿、水润亮肤）",
                    "jp": "9900",
                    "img": "https://img13.360buyimg.com/mobilecms/s372x372_jfs/t1/179865/23/1176/161396/608774b6E532b19bd/73ad7d625a21ef29.jpg",
                    "clk": "//knicks.jd.com/log/server?t=rec_common_clk&v=type=rec.619128$src=rec$action=1$reqsig=72b24cfb044aefedfdba3629e83dc567f6e5d692$enb=1$sku=0$p=619128$pin=$uuid=I%2FsjUXA16jjPhoHHTebvwQ%3D%3D$csku=100003174940$index=13$st=0$adcli=$expid=100$mexpid=$im=$rid=564749069942323743$ver=1$sig=ef9489eb24178aadabefa604c0db18f2fc7fbea0",
                    "link": "https://item.m.jd.com/product/100003174940.html?_fd=jdm&cover=jfs/t1/179865/23/1176/161396/608774b6E532b19bd/73ad7d625a21ef29.jpg&pps=reclike.FO4O605:FOFO0048A75A1C3O13O6:FOFO0FF0416O420016FO3O643O7FFF5021813FO7O1748A75A1C1D91C0F6FB10078E",
                    "source": "0",
                    "sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                    "pps": "reclike.FO4O605:FOFO0048A75A1C3O13O6:FOFO0FF0416O420016FO3O643O7FFF5021813FO7O1748A75A1C1D91C0F6FB10078E",
                    "rect": "0",
                    "c3": "1392",
                    "tips": [],
                    "icon": "1",
                    "icon1": "1,2",
                    "prom": "0",
                    "paicon": "1",
                    "paicon1": "1",
                    "dpicon": {
                      "icon": "0",
                      "p": "",
                      "count": "0"
                    },
                    "jpnonshow": "0",
                    "wt": "",
                    "renl": "",
                    "client_exposal_url": "",
                    "reserve": "0",
                    "presellyd": "",
                    "rp": {
                      "source": "3",
                      "ad_sid": "74690b90-ba55-416d-9168-7bda70b24dfa",
                      "broker_info": "eyJwIjoiNjE5MTI4Iiwic291cmNlIjoiMCIsInRhZyI6IjYiLCJjc191c2VyIjoiMiIsImV4cGlkIjoiMTAwIiwicmVxc2lnIjoiNzJiMjRjZmIwNDRhZWZlZGZkYmEzNjI5ZTgzZGM1NjdmNmU1ZDY5MiJ9"
                    }
                  }
                ]}}
          }
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
        })
      }
    },
  }
</script>
<style scoped>
  /* 对应下面的方法一 */
  #home {
    padding-top: 44px;
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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
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

  /* 方法二 */
  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>