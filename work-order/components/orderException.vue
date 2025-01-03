<template>
  <div class="order-exception-content">
    <div class="order-exception-content">
      <section>
        <header>针对该笔交易若您还有其他问题？</header>
        <div>
          <span><d2-icon-svg name="icon_notice" class="icon_notice" /></span>
          <span class="icon-text">描述您的问题</span>
        </div>
      </section>
      <section>
        <img class="icon-pc" src="https://t7.baidu.com/it/u=2851519759,1970679361&fm=218&app=126&size=f242,150&n=0&f=PNG?s=B49AA576C1814CE8584145CE03003033&sec=1710867600&t=9ad23f61da8c49159d15a949a4ae6265" alt="">
      </section>
    </div>
  </div>
</template>
<script>

export default {
  name: 'OrderException',
  components: { },
  data() {
    return {
    };
  },
  watch: {
  },
  created() {

  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.order-exception-content {
  width: 900px;
  height: 112px;
  display: inline-flex;
  flex-direction: column;
  place-content: flex-start;
  place-items: flex-start;
  border-radius: 12px;
  background: rgba(248, 248, 248, 1);
  .order-exception-content{
    display:flex;
    justify-content:space-between;
    flex-direction: row;
    display: flex;
    align-items: center;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    header{
      font-family: Poppins;
      font-size: 18px;
      font-weight: 600;
      color: #1B1D1F;
      margin-bottom: 18px;
    }
    .icon-text{
      font-family: Poppins;
      font-size: 14px;
      font-weight: 500;
      color: #0C71FF;
      cursor: pointer;
    }
    .icon-pc{
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .icon_notice{
      color: #0C71FF;
    }
    .other-quersion-text{
      margin-top:7px;
    }
  }
}
</style>
