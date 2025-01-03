<template>
  <div class="question-card-content">
    <header>
      {{ language === 'cn' ? title : enTitle }}
    </header>
    <div class="question-card-main">
      <el-row>
        <el-col v-for="(item, index) in cardlist" :key="index" :span="8">
          <div class="grid-content" @click="goQuestion(item)">
            {{ language === 'cn' ? item.zhName : item.enName }}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'QuestionCard',
  components: { },
  data() {
    return {
      title: '常见问题',
      enTitle: 'Common question',
      cardlist: [
        {
          zhName: '财务问题咨询',
          enName: 'Finance related question',
          problemType: 'FINANCE'
        },
        {
          zhName: '产线问题咨询',
          enName: 'Production line related question',
          problemType: 'PRODUCTION'
        },
        {
          zhName: '投诉与建议',
          enName: 'Complaints and suggestions',
          problemType: 'COMPLAIN'
        },
        {
          zhName: '商户平台操作问题',
          enName: 'Merchant platform question',
          problemType: 'MMC'
        },
        {
          zhName: '技术对接问题',
          enName: 'Technical integration question',
          problemType: 'API'
        },
        {
          zhName: '其他',
          enName: 'Others',
          problemType: 'OTHER'
        },
      ]
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  watch: {
  },
  created() {
  },
  methods: {
    goQuestion(item) {
      const { zhName, enName, problemType } = item;
      this.$router.push({
        path: '/work-order/inquirySheet',
        query: {
          zhName,
          enName,
          problemType: problemType,
          type: 'CONSULT'
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.question-card-content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    header{
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
      margin-top:40px;
      margin-bottom: 24px;
    }
    .question-card-main{
      width:960px;
      // background-color: blanchedalmond;
      display: flex;
      justify-content: center;
      .grid-content{
        display: flex;
        align-items: center;
        justify-content: center;
        width:289.3px;
        height:75px;
        border-radius: 12px;
        border: 1px solid rgba(234, 234, 234, 1);
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        color: rgba(55, 130, 255, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 18px;
        cursor: pointer;
        &:hover{
          border: 2px solid rgba(12, 113, 255, 1);
          box-shadow: 0px 4px 12px -4px rgba(0, 0, 0, 0.05), 0px 0px 4px rgba(0, 0, 0, 0.05);
        }
      }
    }
    /deep/ .el-col {
          display: flex;
          justify-content: center;
          margin-bottom:16px;
        }
}
</style>
