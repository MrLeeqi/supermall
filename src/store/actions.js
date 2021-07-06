import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types"

export default {
  // addCart({state, commit}, payload) {
  // 变量{}里面为对象的解构写法
  addCart(context, payload) {
    // 1.查找之前的数组中是否有该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    // 2.判断oldProduct
    if (oldProduct) {
      //   oldProduct.count += 1
      context.commit(ADD_COUNTER, oldProduct)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
    }
  }
}