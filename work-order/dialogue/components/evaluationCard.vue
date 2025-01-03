<template>
  <div class="evaluation-card">
    <!-- 评论弹框 -->
    <EvaluationFrame :title="title" :show-dialog="showDialog" @dialogCallback="dialogCallback" />
    <div class="common-card">
      <!-- 已经评价过 -->
      <div class="desc">
        <div class="desc-title">{{ language === 'cn' ? topTitle : topTitleEn }}</div>
        <!-- 选择评价的时候 -->
        <div style="padding: 8px 0px">
          <el-rate
            v-model="rate"
            :texts="language == 'cn' ? cT : eT"
            :colors="colors"
            :disabled="disabled"
            show-text
            void-color="#DDDDDD"
            @change="handleChange" />
        </div>
        <div v-if="commonEvaText || evaluationCardInfo.content" class="common-eva-first">
          {{ commonEvaText || evaluationCardInfo.content }}
        </div>
      </div>
      <div v-if="evaluationCardInfo.evaluationTime" class="time">{{ evaluationCardInfo.evaluationTime | formateDate }}</div>
    </div>
    <div v-if="showEndtalk || evaluationCardInfo.score" class="bottom-eva">
      <div :class="[commonEvaText? 'contentFirst' : 'content']">{{ $t('workOrderInfo.thankYouForYourReview') }}</div>
    </div>
    <!-- <div v-if="evaluationCardInfo.content" class="common-eva">
      {{ evaluationCardInfo.content }}
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EvaluationFrame from './evaluationFrame';
import { evaluate } from '@/api/workOrder';
import datetime from '@/libs/util.datetime';

export default {
  name: 'EvaluationCard',
  components: { EvaluationFrame },
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    evaluationCardInfo: {
      type: Object,
      default: () => { }
    },
    updateHistory: {
      type: Function,
      default: () => { }
    },
  },
  data() {
    return {
      showDialog: false,
      topTitle: '满意度评价',
      topTitleEn: 'Satisfaction Rating',
      title: '',
      commonEvaText: '',
      showEndtalk: false,
      rate: 0,
      cT: ['极差', '失望', '一般', '满意', '太赞了'],
      eT: ['Terrible', 'disappointed', 'Average', 'Satisfied', 'Amazing'],
      colors: ['#FB9701', '#FB9701', '#FB9701', '#FB9701', '#FB9701'],
      cP: ['极差，我要投诉', '失望，我要吐槽', '一般，有待改进的地方', '满意，多说两句', '太赞了，我想夸一夸'],
      eP: ['Terrible, I want to file a complaint', 'disappointed, I want to file a complaint', 'Average, there is room for improvement', 'Satisfied, let me elaborate more', 'Amazing, I would like like to compliment'],
      disabled: false
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'platformTimezone',
    ])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    if (this.evaluationCardInfo.score) {
      [this.rate, this.disabled] = [this.evaluationCardInfo.score, true];
    }
  },
  methods: {
    handleChange(v) {
      if (!this.evaluationCardInfo.score) {
        [this.showDialog, this.disabled] = [true, true];
        if (this.rate) {
          if (this.language === 'cn') {
            this.title = this.cP[Number(this.rate) - 1];
          } else {
            this.title = this.eP[Number(this.rate) - 1];
          }
        }
        this.setEvaluate('');
      } else {
        this.disabled = true;
      }
    },
    dialogCallback(data) {
      this.showDialog = false;
      const { type, val = '' } = data;
      const { evaForm } = val;
      if (type === 'ok') {
        this.commonEvaText = evaForm.evaText || '';
        this.setEvaluate(evaForm.evaText || '');
      }
    },
    setEvaluate(content) {
      const params = {
        formNo: this.$route.query.formNo || '',
        score: this.rate,
        content,
      };
      evaluate(params)
        .then(response => {
          if (response.data) {
            const result = response.data;
            const { code, data } = result;
            if (code === 'APPLY_SUCCESS') {
              this.showEndtalk = true;
              const { type, status } = data;
              console.log(type, status);
              // 需要更新工单记录
              this.$emit('updateHistory');
            }
          }
        });
    }

  }
};
</script>

<style scoped lang="scss">
.evaluation-card{
  .common-card{
    margin-top:10px;
    width: calc(100vw - 468px);
    .desc{
      color: #9DA2A7;
      font-size: 14px;
      line-height: 21px;
      font-family: Poppins;
      padding:  24px 24px;
      border-radius: 12px;
      border-left: 4px solid rgba(0, 195, 82, 1);
      background: rgba(255, 255, 255, 1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      /deep/ .el-rate__icon{
        font-size: 24px;
      }
      .void-icon-class{
        height: 24px;
        width: 24px;
      }
      .desc-title{
        font-size: 14px;
        font-weight: 600;
        color: rgba(27, 29, 31, 1);
      }
      .data-list{
        margin-top:8px;
        display: flex;
        .data-list-item{
          margin-right:35.7px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .heighLight{
            color: rgba(27, 29, 31, 1);
          }
          .eva-img{
            cursor: pointer;
            img{
              width: 36.7px;
              height: 36.7px;
              object-fit: contain;
            }
          }
        }
      }
      .common-eva{
        margin-top:6px;
        color: #727880;
        // width: calc(100vw - 515px);
        max-width: 800px;
        word-wrap: break-word;
      }
      .common-eva-first{
        margin-top:6px;
        color: #727880;
        max-width: 900px;
        word-wrap: break-word;
      }
    }
    .time{
      color: rgba(157, 162, 167, 1);
      font-family: Poppins;
      font-size: 12px;
      // margin-top: 8px;
      margin-left:24px;
    }
  }
  .bottom-eva{
    display: flex;
    justify-content: center;
    color: #9da2a7;
    .content{
      text-align: center;
      position: absolute;
      display: flex;
      justify-content: center;
      bottom: 0;
      margin-bottom: 5px;
    }
    .contentFirst{
      text-align: center;
      position: absolute;
      display: flex;
      justify-content: center;
      bottom: 0;
      margin-bottom: 5px;
    }
  }
}
</style>
