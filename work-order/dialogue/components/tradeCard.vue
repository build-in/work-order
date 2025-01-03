<template>
  <div class="trade-card">
    <div>
      <!-- <el-tooltip class='item' effect='dark' :content= "tradeCardInfo.description" placement='top-start'>
        <div v-if="tradeCardInfo.description" style="display: flex;">
            <div>{{ tradeCardInfo.description.substring(0, 40)}}</div>
            <div v-if="tradeCardInfo.description.length > 40">...</div>
          </div>
      </el-tooltip> -->
      <el-tooltip v-if="tradeCardInfo.description" :content="tradeCardInfo.description" class="item" effect="dark" placement="top-start">
        <div class="hideline">{{ (tradeCardInfo.description.length > 30 ? tradeCardInfo.description.substring(0, 30)+ '...': tradeCardInfo.description) || ' ' }}</div>
      </el-tooltip>
      <!-- <span v-if="tradeCardInfo.inputOrderNo">{{ tradeCardInfo.inputOrderNo }} - </span> -->
      <!-- <span v-if="tradeCardInfo.type == 'TRADE'">{{ setWorkType(tradeCardInfo.type, language) }}</span>
      <span v-if="tradeCardInfo.type == 'CONSULT'">{{ setProlblem(tradeCardInfo.problemType, language) }}</span> -->
      <div v-if="tradeCardInfo.status && tradeCardInfo.status =='PROCESS' " class="status proce">{{ setStatus(tradeCardInfo.status,language) }}</div>
      <div v-if="tradeCardInfo.status && tradeCardInfo.status =='FINISHED' " class="status finsih">{{ setStatus(tradeCardInfo.status,language) }}</div>
    </div>
  </div>
</template>

<script>
import { TYPE, STATUS, PROBLEM_TYPE } from '../../const/index';
import { mapState } from 'vuex';
// 工单类型
export default {
  name: 'TradeCard',
  components: { },
  props: {
    tradeCardInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      info: {}
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
    setWorkType(text, language) {
      const current = TYPE.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
    setStatus(text, language) {
      const current = STATUS.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
    setProlblem(text, language) {
      const current = PROBLEM_TYPE.find(item => item.nameEn === text) || {};
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
.trade-card{
  height: 50px;
  display: flex;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  padding: 0 30px;
  .hideline{
    font-size: 20px !important;
  }
  :nth-child(1){
    color: rgba(27, 29, 31, 1);
    font-family: Poppins-SemiBold;
    font-size: 16px;
    display: flex;
    align-items: center;
    margin-right: 8px;
    font-weight: 600;
  }
  .status{
    // height: 28px;
    // line-height: 28px;
    margin-left:8px;
    font-family: Poppins;
    font-weight: 600;
    font-size: 12px;
    padding: 3px 12px;
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
</style>
