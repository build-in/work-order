<template>
  <div class="nav-order-create">
    <div class="search-content-mess">
      <TransactionInformation :title="language=== 'cn'? info.firstHintCn : info.firstHintEn " :status="status" :info="info.orderInfoList" />
    </div>
    <div class="search-guess-mess">
      <GuessWhatYouWant v-if="info.inputOrderNo && info.guessAskList" :guess-list="info.guessAskList" />
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import TransactionInformation from '../components/transactionInformation';
import GuessWhatYouWant from '../components/guessWhatYouWant';

export default {
  name: 'Content',
  components: {
    TransactionInformation,
    GuessWhatYouWant
  },
  data() {
    return {
      title: '该笔订单已申请退款，退款状态为成功',
      status: '',
      info: {},
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'platformTimezone',
    ])
  },
  watch: {
    '$route'(to, from) {
      this.info = this.$route.query || {};
    }
  },
  mounted() {
    this.info = this.$route.query || {};
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.search-content-mess {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.search-guess-mess {
  // margin-top:40px;
  display: flex;
  justify-content: center;
}
</style>
