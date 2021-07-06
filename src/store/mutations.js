import { 
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types"

export default {
  // addCart(state, payload) {
  // mutations唯一的目的就是修改state中的状态
  // 所以这里面的每个方法尽可能完成的事件比较单一一点
  // 以下代码我们做了两件事情， 一个是添加新的商品，一个是将旧商品数量加一，
  // 在这里如果我们想看到底是二者的哪一个是没办法知道的，所以要重构一下
  // 首先得判断该商品是否已经存在
  // 方法一
  // let oldProduct = null
  // for (let item of state.cartList) {
  //   if (item.iid === payload.iid) {
  //     oldProduct = item
  //   }
  // }
  // let oldProduct = state.cartList.find(item => item.iid === payload.iid)
  // if (oldProduct) {
  //   oldProduct.count += 1
  // }
  // else {
  //   payload.count = 1
  //   state.cartList.push(payload)
  // }
  // }
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}