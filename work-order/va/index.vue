<template>
  <div class="nav-order-create">
    <div class="search-content-mess">
      <ProblemDescription :title="$t(`workOrderInfo.yourLocalReceivingAccountNumber`)" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ProblemDescription from '../components/problemDescription';

export default {
  name: 'WorkOrder',
  components: {
    ProblemDescription,
  },
  data() {
    return {
      //  title: '查询到这是您的本地收款账户号，请提供想要咨询的订单相关的汇款凭证，并描述您的问题，我们会尽快为您解答',
      //  titleEn: 'We have found that this is your local receiving account number, please provide the remittance voucher related to the order you want to consult about, and describe your question, and we will reply you as soon as possible.'
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.search-content-mess {
  margin-top: 40px;
}
</style>
