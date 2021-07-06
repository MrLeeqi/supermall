import {request} from './request'

export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

export function getRecommend() {
  return request({
    url: '/recommend',
  })
}

export class Goods {
  constructor(itemInfo, priceInfo, itemServices) {
    this.oldPrice = itemInfo.highPrice
    this.newPrice = itemInfo.highNowPrice
    this.realPrice = itemInfo.lowNowPrice
    this.cFav = itemInfo.cFav
    this.priceTags = priceInfo.priceTags
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.columns = itemServices.columns
    this.services = itemServices.services
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo
    this.name = shopInfo.name
    this.fans = shopInfo.cFans
    this.sells = shopInfo.cSells
    this.score = shopInfo.score
    this.goodsCount = shopInfo.cGoods
  }
}

export class GoodsParam {
  constructor(info, rule) {
    this.image = info.images ? info.images[0] : ''
    this.infos = info.set
    this.sizes = rule.tables
  }
}
