<template>
  <div class="existing-create">
    <div class="search-content-mess">
      <TransactionInformation :title="$t(`workOrderInfo.transactionHasCreatedAWorkOrder`)" :status="status" :info="info" />
    </div>
    <div class="existing-footer">
      <div class="footer">
        <el-button @click="goBack">{{ $t('workOrderInfo.return') }}</el-button>
        <el-button type="primary" @click="lookDetail">{{ $t('workOrderInfo.viewProcessingDetails') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>

import TransactionInformation from '../components/transactionInformation';

export default {
  name: 'Existing',
  components: {
    TransactionInformation
  },
  data() {
    return {
      // title: '该笔交易已创建工单',
      status: '',
      info: {}
    };
  },
  watch: {
    '$route'(to, from) {
      this.info = this.$route.query.orderInfoList;
      this.status = this.$route.query.status;
    }
  },
  mounted() {
    this.info = this.$route.query.orderInfoList;
    this.status = this.$route.query.status;
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/work-order/create' });
      var input = document.getElementById('clentSearchId');
      input.value = ''; // 将input的值设置为空字符串
    },
    lookDetail() {
      if (this.$route.query.formNo) {
        this.$router.push({ path: '/work-order/dialogue', query: this.$route.query });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.existing-create {
  margin-top: 40px;
  .search-content-mess {
    display: flex;
    justify-content: center;
  }
  .existing-footer{
    display: flex;
    justify-content: center;
    .footer{
      margin-top:32px;
      width: 900px;
      display: flex;
      justify-content: end;
    }
  }
}
</style>
