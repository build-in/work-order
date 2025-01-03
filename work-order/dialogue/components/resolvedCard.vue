<template>
  <div class="resolved-card">
    <div class="common-card">
      <div class="desc">
        <div>{{ language === 'cn' ? parerFont(item.content).cn : parerFont(item.content).en }}</div>
        <div class="data-list">
          <!-- 可点击情况 -->
          <div v-if="parerFont(item.content) && parerFont(item.content).unsolved && parerFont(item.content).solved && finish == 'PROCESS'" class="data-list-item">
            <div v-if="parerFont(item.content) && parerFont(item.content).unsolved" class="data-list-content" @click="tapBtn('unsolved')">
              <div class="icont-side"><d2-icon :name="`close`" :class="`iconclose`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).unsolved : parerFont(item.content).unsolvedEn }}</div>
            </div>
            <div v-if="parerFont(item.content) && parerFont(item.content).solved" class="data-list-content content-sec" @click="tapBtn('solved')">
              <div class="icont-side"><d2-icon :name="`read`" :class="`iconread`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).solved : parerFont(item.content).solvedEn }}</div>
            </div>
          </div>
          <!-- 系统自动关单的情况 -->
          <div v-else-if="finish == 'FINISHED'" class="data-list-item" style="cursor: default;">
            <div v-if="parerFont(item.content) && parerFont(item.content).unsolved" class="data-list-content">
              <div class="icont-side"><d2-icon :name="`close`" :class="`iconclose`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).unsolved : parerFont(item.content).unsolvedEn }}</div>
            </div>
            <div v-if="parerFont(item.content) && parerFont(item.content).solved" class="data-list-content content-sec">
              <div class="icont-side"><d2-icon :name="`read`" :class="`iconread`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).solved : parerFont(item.content).solvedEn }}</div>
            </div>
          </div>
          <!-- 不可点击情况 -->
          <div v-else class="data-list-item" style="cursor: default;">
            <div v-if="parerFont(item.content) && parerFont(item.content).unsolved" class="data-list-content">
              <div class="icont-side"><d2-icon :name="`close`" :class="`iconclose`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).unsolved : parerFont(item.content).unsolvedEn }}</div>
            </div>
            <div v-if="parerFont(item.content) && parerFont(item.content).solved" class="data-list-content content-sec">
              <div class="icont-side"><d2-icon :name="`read`" :class="`iconread`" /></div>
              <div>{{ language === 'cn' ? parerFont(item.content).solved : parerFont(item.content).solvedEn }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="time">{{ item.createTime | formateDate }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { orderUpdate } from '@/api/workOrder';
import datetime from '@/libs/util.datetime';
// import { throttle } from 'lodash';
export default {
  name: 'ResolvedCard',
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    updateHistory: {
      type: Function,
      default: () => {}
    },
    finish: {
      type: String,
      default: ' '
    },
  },
  data() {
    return {
      list: [
        {
          name: '未解决',
          enName: 'unResolved',
          iconName: 'close',
        },
        {
          name: '已解决',
          enName: 'resolved',
          iconName: 'read',
        },
      ]
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
    parerFont(text) {
      return JSON.parse(text);
    },
    tapBtn(status) {
      switch (status) {
        case 'unsolved':
          this.getOrderUpdate(false);
          this.$message({
            message: this.$t('workOrderInfo.sorryForNotSatisfyingYou'),
            type: 'success',
          });
          break;
        case 'solved':
          this.getOrderUpdate(true);
          // this.$message({
          //   message: this.$t('workOrderInfo.thankYouForYourInquiry'),
          //   type: 'success',
          // });
          break;
        default:
          break;
      }
    },
    getOrderUpdate(status) {
      const params = {
        formNo: this.$route.query.formNo || '',
        isResolved: status,
        status: ''
      };
      orderUpdate(params)
        .then(response => {
          if (response.data) {
            const result = response.data;
            const { code } = result;
            if (code === 'APPLY_SUCCESS') {
              // 需要更新工单记录
              this.$emit('updateHistory');
            }
          }
        });
    },
  }
};
</script>

<style scoped lang="scss">
.resolved-card {
  padding: 0 30px;
  width: 311px;
  .common-card {
    margin-top: 10px;
    // width: calc(100vw - 468px);

    .desc {
      color: rgba(27, 29, 31, 1);
      font-size: 14px;
      line-height: 21px;
      font-family: Poppins;
      padding: 8px 24px;
      border-radius: 12px;
      border-left: 4px solid rgba(0, 195, 82, 1);
      background: rgba(255, 255, 255, 1);

      // width: 972px;
      .data-list {
        margin-top: 8px;
        margin-left: -8px;
        display: flex;
        flex-wrap: wrap;

        /* 允许换行 */
        .data-list-item {
          display: flex;
          flex: 0 0 auto;
          /* 不增长、不缩小、基于内容的大小 */
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          margin-left: 8px;
          cursor: pointer;
          .icont-side{
            margin-top: 2px;
            margin-right: 2px;
            .iconread{
              color: rgba(0, 195, 82, 1);
            }
          }
          .data-list-content {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px 16px;
            border-radius: 16px;
            border: 1px solid rgba(234, 234, 234, 1);
            box-sizing: border-box;
            color: rgba(114, 120, 128, 1);
            font-family: Poppins;
            font-size: 14px;
          }
          .content-sec{
            margin-left: 8px;
            color: rgba(0, 195, 82, 1);
            border: 1px solid rgba(0, 195, 82, 1);
          }

          // &:first-child{
          //   margin-left: 0px;
          // }
        }
      }
    }

    .time {
      color: rgba(157, 162, 167, 1);
      font-family: Poppins;
      font-size: 12px;
      // margin-top: 8px;
      // margin-left: 24px;
      display: flex;
      justify-content: start;
      margin-left:5px;
    }
  }
}
</style>
