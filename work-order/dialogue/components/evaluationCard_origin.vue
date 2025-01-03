<template>
  <div class="evaluation-card">
    <!-- 评论弹框 -->
    <EvaluationFrame :title="title" :show-dialog="showDialog" @dialogCallback="dialogCallback" />
    <div class="common-card">
      <!-- 已经评价过 -->
      <div class="desc">
        <div class="desc-title">{{ language === 'cn' ? topTitle : topTitleEn }}</div>
        <div v-if="evaluationCardInfo.score">
          <div class="data-list">
            <div v-for="(item,index) in evaluateList" :key="index" class="data-list-item">
              <div class="eva-img">
                <img v-if="evaluationCardInfo.score == index" :src="item.highlight" alt="">
                <img v-else :src="item.primitive" alt="">
              </div>
              <div v-if="evaluationCardInfo.score == index" class="heighLight">{{ language === 'cn' ? item.text : item.enText }}</div>
              <div v-else>{{ language === 'cn' ? item.text : item.enText }}</div>
            </div>
          </div>
          <div v-if="evaluationCardInfo.content" class="common-eva">
            {{ evaluationCardInfo.content }}
          </div>
        </div>
        <!-- 选择评价的时候 -->
        <div v-else>
          <div class="data-list">
            <div v-for="(item,index) in evaluateList" :key="index" class="data-list-item" @click="chooseEva(item,index,evaluationCardInfo,language)">
              <div class="eva-img">
                <img v-if="item.active" :src="item.highlight" alt="">
                <img v-else :src="item.primitive" alt="">
              </div>
              <div v-if="evaluationCardInfo.score == index" class="heighLight">{{ language === 'cn' ? item.text : item.enText }}</div>
              <div v-else>{{ language === 'cn' ? item.text : item.enText }}</div>
            </div>
          </div>
          <div v-if="commonEvaText" class="common-eva-first">
            {{ commonEvaText }}
          </div>
        </div>
      </div>
      <div v-if="evaluationCardInfo.evaluationTime" class="time">{{ evaluationCardInfo.evaluationTime | formateDate }}</div>
    </div>
    <div v-if="showEndtalk || evaluationCardInfo.score" class="bottom-eva">
      <div :class="[commonEvaText? 'contentFirst' : 'content']">{{ $t('workOrderInfo.thankYouForYourReview') }}</div>
    </div>
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
      evaluateList: [
        {
          id: 0,
          highlight: 'https://img-cdn.payermax.com/mmc/icon/angry-face.png',
          primitive: 'https://img-cdn.payermax.com/mmc/icon/angry-face-Unselected.png',
          status: '',
          text: '不满意',
          enText: 'Dissatisfied',
          language: 'zn',
          active: false,
          innerText: '不满意，我要吐槽',
          innerTextEn: 'Dissatisfied, I want to complain',
        },
        {
          id: 1,
          highlight: 'https://img-cdn.payermax.com/mmc/icon/laugh-17.png',
          primitive: 'https://img-cdn.payermax.com/mmc/icon/laugh-17-Unselected.png',
          status: '',
          text: '满意',
          enText: 'Satisfied',
          language: 'zn',
          active: false,
          innerText: '满意，有待改进的地方',
          innerTextEn: "Satisfied, but there's space for improvement",
        },
        {
          id: 2,
          highlight: 'https://img-cdn.payermax.com/mmc/icon/heart-face.png',
          primitive: 'https://img-cdn.payermax.com/mmc/icon/heart-face-Unselected.png',
          status: '',
          text: '太赞了',
          enText: 'Amazing',
          language: 'zn',
          active: false,
          innerText: '太赞了，我想夸一夸',
          innerTextEn: 'Amazing, I want to compliment',
        }
      ],
      chooseItem: {},
      chooseIndex: '',
      commonEvaText: '',
      showEndtalk: false
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
  methods: {
    chooseEva(item, index, evaluationCardInfo, language) {
      if (!evaluationCardInfo.score) {
        this.chooseItem = item;
        this.showDialog = true;
        this.chooseIndex = index;
        if (language === 'cn') {
          this.title = item.innerText;
        } else {
          this.title = item.innerTextEn;
        }

        // 更新当前列表数据
        const updatedEvaluateList = [...this.evaluateList];

        updatedEvaluateList.find((v) => {
          if (v.id === index) {
            v.active = true;
          } else {
            v.active = false;
          }
        });
        this.evaluateList = updatedEvaluateList;
        this.setEvaluate('');
      }
    },
    dialogCallback(data) {
      this.showDialog = false;
      const { type, val ='' } = data;
      const { evaForm } = val;
      if (type === 'ok') {
        this.commonEvaText = evaForm.evaText || '';
        this.setEvaluate(evaForm.evaText || '');
      }
    },
    setEvaluate(content) {
      const params = {
        formNo: this.$route.query.formNo || '',
        score: this.chooseIndex,
        content,
      };
      console.log(params, 'paramsparams');
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
      padding:  8px 24px;
      border-radius: 12px;
      border-left: 4px solid rgba(0, 195, 82, 1);
      background: rgba(255, 255, 255, 1);
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
