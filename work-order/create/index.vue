<template>
  <div :class="['work-order-create', source == 0 ? '': 'setHeight' ]">
    <div v-if="source == 4">
      <div class="nav-order-create">
        <div class="search-content">
          <div :style="{ backgroundImage: 'url(../../../assets/svg-icons/icons/bannen.svg)'}" class="header">
            <el-row class="header__title">
              <!-- <section>
                <img class="icon-pc" src="../../../../public/image/merchant/device-message.png" alt="">
              </section> -->
              <div class="bg-purple-title">
                {{ $t('workOrderInfo.preQT') }}
              </div>
              <div class="bg-purple-content">
                {{ $t('workOrderInfo.preQC') }}
              </div>
            </el-row>
          </div>
        </div>
      </div>
      <QuestionFileOld />
    </div>
    <QuestionFile v-if="source == 0" />
  </div>
</template>
<script>
import QuestionCard from '../components/questionCard.vue';
import QuestionFile from '../components/questionFile.vue';
import QuestionFileOld from '../components/questionFile_origin';

export default {
  name: 'WorkOrder',
  components: {
    QuestionCard,
    QuestionFile,
    QuestionFileOld,
  },
  data() {
    return {
      currentIndex: 1,
      noticeTotal: 0,
      source: parseInt(window.localStorage.getItem('platform-work-order')) || 0,
    };
  },
  methods: {
    switchRouterItem(item, index) {
      this.currentIndex = index;
      this.$router.push({ name: item.routerName });
    }
  }
};
</script>

  <style scoped lang="scss">
  .work-order-create{
    min-height: calc(100vh - 265px);
    background: #f8f8f8 !important;
  }
  .setHeight{
    min-height: calc(100vh - 64px);
    background: #f8f8f8 !important;
  }
  .work-order{
    .icon-pc{
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-top:-70px;
    }
    .search-content{
      width: 100%;
      height: 260px;
      background-color: #0D223F;
      // background-size: cover;
      // background-position: center;
      // background-repeat: no-repeat;
      background-position: bottom;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIyNjAiIHZpZXdCb3g9IjAgMCAxOTIwIDI2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzU0NDJfODQ3MjUiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjI2MCI+CjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjI2MCIgZmlsbD0iIzBEMjIzRiIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfNTQ0Ml84NDcyNSkiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI0MCAyNjBWMEwxMjM0IDBWMTM3LjE4N0wyNDAgMjYwWiIgZmlsbD0iIzExMkI0RSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI0MCAyMjNMMjQwIDBMNjI4IDBMNjI4IDE3NS4yODNMMjQwIDIyM1oiIGZpbGw9IiMwRDIyM0YiLz4KPHBhdGggb3BhY2l0eT0iMC40IiBkPSJNMTI4OCAwSDE1NDhWMTUzTDE0NTAgMjUxSDEyODhWMFoiIGZpbGw9IiMwMDEyMkMiLz4KPHJlY3QgeD0iMTMzMCIgeT0iNDMiIHdpZHRoPSIxNjMiIGhlaWdodD0iMjMiIGZpbGw9IiMwRDIyM0YiLz4KPHJlY3QgeD0iMTMzMCIgeT0iOTQiIHdpZHRoPSI4MyIgaGVpZ2h0PSIyMyIgZmlsbD0iIzBEMjIzRiIvPgo8cGF0aCBkPSJNMTQ1MSAxNTRIMTU0OEwxNDUxIDI1MVYxNTRaIiBmaWxsPSIjMTEyQjRFIi8+CjwvZz4KPC9zdmc+Cg==');

          /* 确保图像不重复 */
      .header__title {
        padding-top: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        // :nth-child(1) {
        //   font-family: Poppins;
        //   font-size: 28px;
        //   font-weight: 600;
        //   letter-spacing: 0px;
        // }

        // :nth-child(2) {
        //   padding-top: 10px;
        //   font-family: Poppins;
        //   font-size: 14px;
        //   font-weight: 400;
        // }
      }
      .bg-purple-title{
        color: rgba(255, 255, 255, 1);
        font-family: Poppins-SemiBold;
        font-size: 28px;
        margin: 11px 0px;
      }
      .bg-purple-content{
        color: rgba(255, 255, 255, 1);
        font-family: Poppins;
        font-size: 14px;
      }
    }
  }
  </style>
