import {request} from './request'

export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

export class Goods {
  constructor(itemInfo, priceInfo, itemServices) {
    this.oldPrice = itemInfo.highPrice
    this.newPrice = itemInfo.highNowPrice
    this.cFav = itemInfo.cFav
    this.priceTags = priceInfo.priceTags
    this.title = itemInfo.title
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
