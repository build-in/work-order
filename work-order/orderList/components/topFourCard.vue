<template>
  <div class="top-four-card-content">
    <el-row :gutter="16">
      <el-col :span="6" class="four-card-inner">
        <div class="grid-content">
          <div class="grid-content-name">{{ $t('workOrderInfo.allWorkOrders') }}</div>
          <div class="grid-content-count">{{ overviewData.total || 0 }}</div>
        </div>
      </el-col>
      <el-col :span="6" class="four-card-inner">
        <div class="grid-content">
          <div class="grid-content-name">{{ $t('workOrderInfo.thisMonthSWorkOrder') }}</div>
          <div class="grid-content-count">{{ overviewData.currentMonthCount || 0 }}</div>
        </div>
      </el-col>
      <el-col :span="6" class="four-card-inner">
        <div class="grid-content">
          <div class="grid-content-name">{{ $t('workOrderInfo.inProcess') }}</div>
          <div class="grid-content-count">{{ overviewData.processCount || 0 }}</div>
        </div>
      </el-col>
      <el-col :span="6" class="four-card-inner">
        <div class="grid-content">
          <div class="grid-content-name">{{ $t('workOrderInfo.completed') }}</div>
          <div class="grid-content-count">{{ overviewData.finishedCount || 0 }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'TopFourCard',
  props: {
    overviewData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top-four-card-content {
  width:100%;
  .four-card-inner{
    .grid-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 59px;
      border-radius: 12px;
      .grid-content-count{
        color: rgba(27, 29, 31, 1);
        font-weight: 500;
        font-family: Poppins-SemiBold;
        font-size: 18px;
      }
      .grid-content-name{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 12px;
      }
    }
  }
  .four-card-inner:nth-child(1) .grid-content {
    background: rgba(236, 243, 255, 1);
  }
  .four-card-inner:nth-child(2) .grid-content {
    background: rgba(245, 237, 253, 1);
  }
  .four-card-inner:nth-child(3) .grid-content {
    background: rgba(255, 241, 215, 1);
  }
  .four-card-inner:nth-child(4) .grid-content {
    background: rgba(230, 249, 239, 1);
  }
}
</style>