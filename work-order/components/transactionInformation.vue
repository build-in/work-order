<template>
  <div class="work-been-added-content">
    <header>
      <div class="work-been-title">
        <div v-if="title">{{ title }}</div>
        <div v-if="status =='PROCESS'" class="status proce">{{ setStatus(status,language) }}</div>
        <div v-if="status =='FINISH'" class="status finsih">{{ setStatus(status,language) }}</div>
      </div>
    </header>
    <el-divider />
    <section>
      <OrderDetail :info="info" />
    </section>
  </div>
</template>
<script>

import OrderDetail from '../common/orderDetail';
import { STATUS } from '../const/index';
import { mapState } from 'vuex';
export default {
  name: 'TransactionInformation',
  components: { OrderDetail },
  props: {
    title: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
    ]),
  },
  watch: {
  },
  created() {

  },
  methods: {
    goOrder() {
      console.log('hbbhib');
    },
    setStatus(text, language) {
      const current = STATUS.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
  }
};
</script>

<style scoped lang="scss">
.work-been-added-content{
  width:900px;
  header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ .el-divider--horizontal{
    margin: 24px 0 35px 0;
  }
  .work-been-title{
    display: flex;
    align-items: center;
    :nth-child(1){
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
    }
    .status{
    height: 28px;
    line-height: 28px;
    margin-left:8px;
    font-family: Poppins;
    font-weight: 500;
    font-size: 14px;
    padding: 4px 12px;
    border-radius: 14px;
  }
  .proce{
    color: rgba(251, 151, 1, 1);
    background: rgba(255, 241, 215, 1);
  }
  .finsih{
    color: rgba(0, 195, 82, 1);
    background: rgba(230, 249, 239, 1);
  }
  }
  ul{
    margin-left:-40px;
    margin-bottom: 28px;
    font-family: Poppins;
    li{
      list-style: none;
      margin-bottom: 12px;
      position: relative;
      &:last-child{
        margin-bottom: 0;
      }
      span {
        &:nth-child(2){
          margin-left: 3.5px;
          color: rgba(114, 120, 128, 1);
          font-size: 14px;
        }
        &:nth-child(3){
          position: absolute;
          left:0;
          margin-left:136px;
          color: rgba(0, 0, 0, 1);
          font-size: 14px;
        }
      }
      .order-detail{
        color: rgba(55, 130, 255, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
</style>
