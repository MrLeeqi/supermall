<template lang="">
  <Tab-bar>
    <tab-bar-item link='/home'>
      <template v-slot:itemIcon>
        <img src="~assets/img/tabbar/home.png" alt="">
      </template>
      <template v-slot:ItemIconActive>
        <img src="~assets/img/tabbar/home_active.png" alt="">
      </template>
      <template v-slot:itemText>
        <div>首页</div>
      </template>
    </tab-bar-item>
    <tab-bar-item link='/category'>
      <template v-slot:itemIcon>
        <img src="~assets/img/tabbar/categories.png" alt="">
      </template>
      <template v-slot:ItemIconActive>
        <img src="~assets/img/tabbar/categories_active.png" alt="">
      </template>
      <template v-slot:itemText>
        <div>分类</div>
      </template>
    </tab-bar-item>
    <tab-bar-item link='/cart'>
      <template v-slot:itemIcon>
        <img src="~assets/img/tabbar/shopcart.png" alt="">
      </template>
      <template v-slot:ItemIconActive>
        <img src="~assets/img/tabbar/shopcart_active.png" alt="">
      </template>
      <template v-slot:itemText>
        <div>购物车</div>
      </template>
    </tab-bar-item>
    <!-- <tab-bar-item link='/profile' activeColor='Pink'> -->
    <tab-bar-item link='/profile'>
      <template v-slot:itemIcon>
        <img src="~assets/img/tabbar/profile.png" alt="">
      </template>
      <template v-slot:ItemIconActive>
        <img src="~assets/img/tabbar/profile_active.png" alt="">
      </template>
      <template v-slot:itemText>
        <div>我的</div>
      </template>
    </tab-bar-item>
  </Tab-bar>
</template>
<script>
  import TabBar from 'components/common/tabbar/TabBar'
  import TabBarItem from 'components/common/tabbar/TabBarItem'

  export default {
    name: 'MainTabBar',
    components: {
      TabBar,
      TabBarItem
    }
  }
</script>
<style lang="">

</style>