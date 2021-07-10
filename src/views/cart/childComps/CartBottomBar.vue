<template lang="">
  <div class="bottom-bar">
    <div class="check-content" @click='selectAll'>
      <!-- 也可以把【@click='selectAll'】放在【check-button】组件上，但是要加上【@click.native='selectAll'】(组件上的点击事件要加上native) -->
      <!-- 这里把它放在【div】上的原因是我可以点击【全选】两个字点击事件也可以生效 -->
      <check-button class="check-button" :is-checked='isSelectAll'></check-button>
      <span>全选</span>
    </div>
    <div class="total-content">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click='calcClick'>
      去计算({{checkLength}})
    </div>
  </div>
</template>
<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0) return false
        // 方法一
        // return this.cartList.filter(item => item.checked).length === this.cartList.length
        // 方法二
        // return !(this.cartList.filter(item => !item.checked).length)
        // 方法三
        // for (let item of this.cartList) {
        //   if(!item.checked) {
        //     return false
        //   }
        // }
        // return true
        // 方法四(如果出于性能考虑，选择此方法会好一点，比前面几种的性能要高一些)
        return !(this.cartList.find(item => !item.checked))
      }
    },
    methods: {
      // 我的做法
      // selectAll() {
      //   if (this.cartList.filter(item => item.checked).length === this.cartList.length){
      //     this.cartList.map(item => item.checked=false)
      //   } else{
      //     this.cartList.map(item => item.checked=true)
      //   }
      // }
      selectAll() {
        if (this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false);
        } else {
          this.cartList.forEach(item => item.checked = true);
        }
      },
      calcClick() {
        if (this.cartList.find(item => item.checked)) {
          this.$toast.show('正在跳转至结算页...', 2000)
        } else {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    },
  }
</script>
<style scoped>
  .bottom-bar {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
  }

  .check-button {
    width: 20px;
    height: 20px;
    margin: 0 5px 0;
    line-height: 20px;
  }

  .check-content {
    display: flex;
    align-items: center;
    width: 65px;
  }

  .total-content {
    margin-left: 10px;
    flex: 1;
  }

  .calculate {
    width: 100px;
    text-align: center;
    background-color: red;
    color: #fff;
  }
</style>