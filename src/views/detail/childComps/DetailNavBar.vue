<template lang="">
  <div>
    <nav-bar>
      <template #left>
        <div class="back" @click='backClick'>
          <img src="~assets/img/common/back.svg" alt="">
        </div>
      </template>
      <template #center>
        <div class="title">
          <div v-for='(item, index) in titles' class="title-item" :class='{active: currentIndex === index}'
            @click='titleClick(index)'>{{item}}</div>
        </div>
      </template>
    </nav-bar>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'
  
  export default {
    name: 'DetailNavBar',
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      titleClick(index) {
        this.currentIndex = index
      },
      backClick() {
        this.$router.back()
      }
    },
  }
</script>
<style lang="css" scoped>
  .title {
    display: flex;
  }

  .title-item {
    flex: 1;
    font-size: 14px;
  }

  .active {
    color: var(--color-high-text);
  }

  .back img {
    margin-top: 12px;
  }
</style>