<template>
  <div class="system-collects">
    <div class="search-content-mess">
      <TransactionInformation :title="$t(`workOrderInfo.detectedAnomaliesInThisTransaction`)" :status="status" :info="info" />
    </div>
    <div class="existing-footer">
      <div class="footer">
        <el-button @click="goBack">{{ $t('workOrderInfo.return') }}</el-button>
        <el-button type="primary" @click="submitThrottle">{{ $t('workOrderInfo.createConsultation') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import TransactionInformation from '../components/transactionInformation';
import { orderCreate } from '@/api/workOrder';
import { throttle } from 'lodash';

export default {
  name: 'SystemCollects',
  components: {
    TransactionInformation
  },
  data() {
    return {
      info: {},
      status: ''
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  watch: {
    '$route'(to, from) {
      this.info = this.$route.query.orderInfoList;
    }
  },
  mounted() {
    this.info = this.$route.query.orderInfoList;
  },
  methods: {
    submitThrottle: throttle(function() {
      this.onSubmit();
    }, 900, { leading: false, trailing: true }),
    goBack() {
      this.$router.push({ path: '/work-order/create' });
      var input = document.getElementById('clentSearchId');
      input.value = '';
    },
    tipMessage(message) {
      this.$message({
        message: message,
        type: 'warning',
      });
    },
    onSubmit() {
      // source | 0：商户平台 4:开发者中心, url默认不传为0：商户平台，开发者中心url会传platform 为 4
      const source = parseInt(window.localStorage.getItem('platform-work-order')) || 0;
      const params = {
        'isAgain': this.$route.query.isAgain ? this.$route.query.isAgain : false,
        'inputOrderNo': this.$route.query.inputOrderNo || '',
        'tradeOrderNo': this.$route.query.tradeOrderNo || '',
        'isExceptionOrder': true,
        'type': this.$route.query.type || '',
        'problemType': this.$route.query.problemType || '',
        'fileInfo': '[]',
        'description': '',
        'merchantId': this.$route.query.merchantId || '',
        source
      };
      console.log(params, 'paramsparams');
      orderCreate(params)
        .then((response) => {
          const { data, code } = response.data || {};
          if (code === 'APPLY_SUCCESS' && data && data.formNo) {
            this.$router.push({
              path: '/work-order/dialogue',
              query: {
                formNo: data.formNo,
                type: this.$route.query.type || '',
                inputOrderNo: this.$route.query.inputOrderNo || '',
                problemType: this.$route.query.problemType || '',
              }
            });
          }
        }).catch((error) => {
          const { data } = error || {};
          switch (data.code) {
            case 'WORK_ORDER_ALREADY_EXISTS':
              this.tipMessage(this.$t('workOrderInfo.orderExisting'));
              break;
            default:
              break;
          }
        });
    },
  }
};
</script>

<style scoped lang="scss">
.system-collects {
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
