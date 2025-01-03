<template>
  <div class="work-order-problem-dialogue">
    <div class="content">
      <div class="left">
        <div class="left-top">
          <div class="left-top-title">
            <TradeCard :trade-card-info="tradeCardInfo" />
          </div>
          <DividerLine />
          <!-- 下面组件根据接口控制显示  遍历控制展示-->
          <div id="DiaScrollContainer" ref="scrollContainer" class="slide-content" @scroll="onScrollContract($event)">
            <div v-for="(item,index) in contactHistory" :key="index">
              <SessionCard v-if="item.type == 'system_contact' || item.type == 'person_contact'" :item="item" />
              <div v-if="item.type === 'hint'" :item="item" class="system-mess">
                <div>
                  <span>{{ language === 'cn' ? parerFont(item.content).cn : parerFont(item.content).en }}</span>
                  <span v-if=" item.content && parerFont(item.content).hasOwnProperty('link')" class="blue" @click="submitThrottle()">{{ language === 'cn' ? '点击这里' : 'Click here' }}</span>
                </div>
              </div>
              <ResolvedCard v-if="item.type === 'select'" :finish="finish" :item="item" @updateHistory="updateHistory" />
            </div>
          </div>
        </div>
        <!-- 上面组件根据接口控制显示 -->
        <div class="evaluation-card-eva">
          <EvaluationCard v-if="finish == 'FINISHED'" :evaluation-card-info = "evaluationCardInfo" @updateHistory="updateHistory" />
        </div>
        <NailAndAttachments v-if="finish == 'PROCESS'" @onlyUpdateChatHistory="onlyUpdateChatHistory" @updateHistory="updateHistory" />
      </div>
      <div class="right">
        <div v-if="detailInfo && detailInfo.tradeCreateTime">
          <div class="title top-title">{{ $t('workOrderInfo.orderDetails') }}</div>
          <OrderDetail :info="detailInfo" />
          <DividerLine />
        </div>
        <div class="title bottom-title">{{ $t('workOrderInfo.workOrderDetails') }}</div>
        <WorkOrderDetail :work-order-info="workOrderInfo" />
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import { throttle } from 'lodash';
import OrderDetail from '../common/orderDetail';
import WorkOrderDetail from '../common/workOrderDetail';
import DividerLine from '../common/dividerLine.vue';
import TradeCard from './components/tradeCard';
import SessionCard from './components/sessionCard';
import EvaluationCard from './components/evaluationCard';
import ResolvedCard from './components/resolvedCard.vue';
import NailAndAttachments from './components/nailAndAttachments';

import { getDetail, getContactHistoryNew, updateMessageStatus, orderCreate } from '@/api/workOrder';

export default {
  name: 'Dialogue',
  components: {
    OrderDetail,
    WorkOrderDetail,
    DividerLine,
    TradeCard,
    SessionCard,
    EvaluationCard,
    ResolvedCard,
    NailAndAttachments
  },
  data() {
    return {
      tradeCardInfo: {},
      detailInfo: {},
      workOrderInfo: {},
      contactHistory: [],
      evaluationCardInfo: {},
      showOrderDetail: '',
      finish: '',
      promise3: '',
      pageNum: 1,
      pageSize: 20,
      loadingInstance: null,
      total: 0,
      timerId: null, // 用于存储定时器的 ID
      timerIdTwo: null,
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'platformTimezone',
    ])
  },
  created() {
    this.getMessage();
  },
  mounted() {
    this.startTimer();
    // this.timerIdTwo = setTimeout(() => {
    //   this.clearTimer();
    // }, 7200000);
  },
  beforeDestroy() {
    clearInterval(this.timerId); // 清除定时器
    this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
  },
  methods: {
    startTimer() {
      this.timerId = setInterval(() => {
        this.contactHistory = [];
        this.pageNum = 0;
        this.getMessage(); // 假设 getMessage 是你的方法
      }, 60000); // 60秒 = 60000毫秒
    },
    clearTimer() {
      clearInterval(this.timerId); // 清除定时器
      clearTimeout(this.timerIdTwo);
      this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
      this.timerIdTwo = null;
    },
    getMessage() {
      this.contactHistory = [];
      try {
        // eslint-disable-next-line new-cap
        // this.promise3 = new Promise.allSettled([this.getworkOrderInfo(), this.getContactHistory(1, this.pageSize)]);
        this.getContactHistory(1, this.pageSize);
        this.getworkOrderInfo();
        // this.scrollBottom();
      } catch (error) {
        this.clearTimer();
      }
    },
    onScrollContract(evt) {
      const { scrollTop } = evt.target;
      const page = this.total / this.pageSize + 1;
      // 滑到底部
      if (scrollTop == 0 && (page > this.pageNum)) {
        // 分页累加
        this.pageNum += 1;
        // this.showLoading();
        this.getContactHistory(this.pageNum, this.pageSize);
        // this.loadingInstance.close();
      }
    },
    // onScrollTop(evt) {
    //   const { scrollTop } = evt.target;
    //   // 滑到底部
    //   if (scrollTop === 0) {
    //     this.loadMore();
    //     console.log('滚动到ding部了~~~');
    //   }
    // },
    // showLoading() {
    //   this.loadingInstance = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(256,256,256,.7)',
    //     target: document.querySelector('.content')
    //   });
    // },
    // scrollToBottom() {
    //   this.$nextTick(() => {
    //     this.$refs.scrollContainer.scrollTop = this.$refs.scrollContainer.scrollHeight;
    //   });
    // },
    scrollBottom() {
      this.$nextTick(() => {
        if(this.$refs.scrollContainer){
          this.$refs.scrollContainer.scrollTop = this.$refs.scrollContainer.scrollHeight;
        }
      });
    },
    getworkOrderInfo() {
      if (this.$route.query.formNo) {
        const params = {
          formNo: this.$route.query.formNo || '',
        };
        getDetail(params)
          .then(response => {
            if (response.data) {
              const result = response.data;
              const { code, data } = result;
              if (code === 'APPLY_SUCCESS') {
                const { type, status, formNo, problemType, createTime, finishTime, creator, orderInfo = {}, evaluationTime, score, content, description, merchantId, tradeOrderNo, inputOrderNo } = data;
                if (status == 'PROCESS') {
                  this.finish = 'PROCESS';
                } else {
                  this.finish = 'FINISHED';
                }
                // 顶部卡片信息
                this.tradeCardInfo = {
                  formNo: this.$route.query.formNo,
                  inputOrderNo: inputOrderNo,
                  problemType: this.$route.query.problemType,
                  type,
                  status,
                  description,
                };
                if (status == 'FINISHED') {
                  clearInterval(this.timerId); // 清除定时器
                  this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
                }

                // 订单详情
                this.detailInfo = orderInfo;
                // 工单详情
                this.workOrderInfo = {
                  formNo,
                  type,
                  problemType,
                  createTime,
                  finishTime,
                  creator,
                  description,
                  merchantId,
                  tradeOrderNo,
                  inputOrderNo,
                };
                // 评价卡片
                this.evaluationCardInfo = {
                  score,
                  content,
                  evaluationTime
                };
                console.log(this.evaluationCardInfo, '评价卡片');
              }
            }
          });
      }
    },
    getContactHistory(pageNum, pageSize) {
      if (this.$route.query.formNo) {
        const params = {
          formNo: this.$route.query.formNo || '',
          pageNum,
          pageSize,
        };
        getContactHistoryNew(params)
          .then(response => {
            if (response.data) {
              const result = response.data;
              const { code, data } = result;
              const { total, rows } = data;
              const contract = rows.reverse();
              if (code === 'APPLY_SUCCESS') {
                this.total = total; // 记录当前聊天记录总数，方便做页数判断
                if (pageSize === 1) {
                  this.contactHistory = [...this.contactHistory, ...contract];
                } else {
                  this.contactHistory = [...contract, ...this.contactHistory];
                }
                // 刚进页面或者发新消息的时候滚动到底部
                if (pageNum === 1) {
                  this.scrollBottom();
                }
                if (pageNum === 1) {
                  // 如果有人工未读消息，进行消息更新
                  this.updateMessage(contract);
                }
                this.contactHistory = this.removeDuplicatesByProperty(this.contactHistory, 'id');
              } else {
                // this.scrollToBottom();
              }
            }
          }).catch((e) => {
            // this.loadingInstance.close();
            console.log(e);
            this.clearTimer();
          }).finally(() => {
            // this.loadingInstance.close();
          });
      }
    },
    removeDuplicatesByProperty(array, propertyName) {
      const uniqueObjects = {};
      const result = [];

      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const key = item[propertyName];

        if (!uniqueObjects[key]) {
          uniqueObjects[key] = true;
          result.push(item);
        }
      }

      return result;
    },
    sortedArr(arr) {
      // const newArr = arr.sort((a, b) => a.createTime - b.createTime);
      // return this.removeDuplicatesByProperty(newArr, 'createTime');
      return arr.sort((a, b) => a.createTime - b.createTime);
    },
    updateMessage(data) {
      const foundObject = data.find(obj =>
        obj.direction === 'T' &&
        obj.readFlag === false &&
        obj.type === 'person_contact'
      );
      if (foundObject && this.$route.query.formNo) {
        const params = {
          formNo: this.$route.query.formNo || '',
          direction: 'T'
        };
        updateMessageStatus(params)
          .then(response => {
            if (response.data) {
              const result = response.data;
              const { code } = result;
              if (code === 'APPLY_SUCCESS') {
                console.log(code, '未读人工数据更新成功！');
              }
            }
          });
      }
    },
    parerFont(text) {
      return JSON.parse(text);
    },
    // 点击已解决 与 未解决刷新对话数据
    updateHistory() {
      // console.log('点击已解决 与 未解决刷新对话数据');
      this.contactHistory = [];
      this.getContactHistory(1, this.pageSize);
      this.getworkOrderInfo();
      this.scrollBottom();
      clearInterval(this.timerId); // 清除定时器
      this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
    },
    // 发送按钮刷新
    onlyUpdateChatHistory() {
      this.getContactHistory(1, 1);
      this.scrollBottom();
    },
    tipMessage(message) {
      this.$message({
        message: message,
        type: 'warning',
      });
    },
    submitThrottle: throttle(function() {
      this.onSubmit();
    }, 900, { leading: false, trailing: true }),
    onSubmit() {
      // source | 0：商户平台 4:开发者中心, url默认不传为0：商户平台，开发者中心url会传platform 为 4
      const source = parseInt(window.localStorage.getItem('platform-work-order')) || 0;
      const params = {
        'inputOrderNo': this.workOrderInfo?.inputOrderNo || '',
        'tradeOrderNo': this.workOrderInfo?.tradeOrderNo || '',
        'isExceptionOrder': false,
        'isAgain': true,
        'type': this.$route.query.type || '',
        'problemType': this.$route.query.problemType || '',
        'fileInfo': '[]',
        'description': this.workOrderInfo?.description || '',
        'merchantId': this.workOrderInfo?.merchantId || '',
        source
      };

      orderCreate(params)
        .then((response) => {
          const { data, code } = response.data || {};
          if (code === 'APPLY_SUCCESS' && data && data.formNo) {
            const routePath = `/work-order/dialogue?formNo=${data.formNo}&type=${this.$route.query.type || ''}&problemType=${this.$route.query.problemType || ''}&inputOrderNo=${this.$route.query.inputOrderNo || ''}&description=${this.workOrderInfo.description || ''}&merchantId=${this.workOrderInfo.description || ''}`;
            window.open(this.$router.resolve(routePath).href, '_blank');
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
    }
  }
};
</script>

  <style scoped lang="scss">
  .work-order-problem-dialogue{
    .content{
      min-height: calc(100vh - 64px);
      display: flex;
      position: relative;
      .left{
        flex:1;
        box-sizing: border-box;
        background: rgba(248, 248, 248, 1);
        .system-mess{
          display: flex;
          justify-content: center;
          color: rgba(157, 162, 167, 1);
          font-family: Poppins;
          font-size: 14px;
          padding: 0 30px;
          text-align: center;
          .blue{
            color: #3782ff;
            cursor: pointer;
          }
        }
        .left-top{
          margin-bottom: 240px;
        }
        .evaluation-card-eva{
          position: absolute;
          background: transparent;
          bottom: 15px;
          padding: 5px 30px 12px 30px;
          // margin-bottom: 30px;
        }
        .slide-content{
          // height:  calc(100vh - 344px);
          height:  calc(100vh - 334px);
          overflow-y: scroll;
          scroll-behavior: smooth;
          // .session-card-container{
          //   display: flex;
          //   justify-content: end;
          // }
        }
      }
      .right{
        width: 408px;
        padding: 0px 30px;
        border-left: 1px solid rgba(234, 234, 234, 1);
        // background: red;
        box-sizing: border-box;
        .title{
          color: rgba(27, 29, 31, 1);
          font-family: Poppins-SemiBold;
          font-size: 16px;
        }
        .top-title,.bottom-title{
          margin-top:24px;
        }
      }
    }
  }
  </style>
