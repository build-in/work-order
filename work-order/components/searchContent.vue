<template>
  <div class="search-gongdan-content">
    <!-- <div class="search-gongdan-main">
      <OtherQuestion />
    </div>
    <div class="search-gongdan-main">
      <AworkOrderBeenAdded />
    </div>
    <div class="search-gongdan-main">
      <SubmitSuccessfully />
    </div>
    <SuccessDialog :title="title" :show-dialog="showDialog" @dialogCallback="dialogCallback" />
    <DividerLine /> -->
    <ProblemDescription />
    <!-- <TipDialog :title="title" :show-dialog="showDialog" @dialogCallback="dialogCallback" /> -->
  </div>
</template>
<script>

import { mapState } from 'vuex';
// import OtherQuestion from './otherQuestion';
// import OrderException from './orderException';
// import AworkOrderBeenAdded from './aWorkOrderBeenAdded';
// import SubmitSuccessfully from './submitSuccessfully';
// import DividerLine from '../common/dividerLine';
// import SuccessDialog from '../common/successDialog';
import ProblemDescription from '../components/problemDescription';
import TipDialog from '../components/tipDialog';

/** *** 按需加载不同的内部组件 ******/
export default {
  name: 'SearchContent',
  components: {
    // OtherQuestion,
    // OrderException,
    // AworkOrderBeenAdded,
    // SubmitSuccessfully,
    // DividerLine,
    TipDialog,
    ProblemDescription
  },
  data() {
    return {
      showDialog: true,
      title: '提示'
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'platformTimezone',
      'selectMerchantGroup'
    ]),
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  watch: {
  },
  created() {
  },
  methods: {
    dialogCallback(data) {
      this.showDialog = false;
      console.log(data, '12345678');
    }
  }

};
</script>

<style scoped lang="scss">
.search-gongdan-content{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .search-gongdan-main{
    width:960px;
    margin-top: 50px;
    background-color: blanchedalmond;
    display: flex;
    justify-content: center;
  }
}
</style>
