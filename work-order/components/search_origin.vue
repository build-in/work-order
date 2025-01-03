<template>
  <div class="search-content">
    <div :style="{ backgroundImage: 'url(../../../assets/svg-icons/icons/bannen.svg)'}" class="header">
      <el-row class="header__title">
        <div class="grid-content bg-purple-dark">
          {{ $t('workOrderInfo.transactionIssues') }}
        </div>
        <div class="grid-content bg-purple-dark">
          {{ $t('workOrderInfo.pleaseEnterThePlatformOrderNumber') }}
        </div>
      </el-row>
      <el-form ref="searchForm" :model="formData" class="search-content-from">
        <el-row type="flex" justify="center">
          <el-col>
            <el-form-item prop="searchString">
              <el-input
                id="clentSearchId"
                ref="clentSearch"
                v-model="formData.searchString"
                :placeholder="$t(`workOrderInfo.exampleNumber`)"
                prefix-icon="el-icon-search"
                class="search-input"
                autofocus="false"
                clearable= "true"
                @change="clearTradeOrderNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="search-input-btn" @click="queryOrderThrottle">
            {{ $t('workOrderInfo.lookup') }}
          </div>
        </el-row>
      </el-form>
    </div>
    <TipDialog
      :title="language == 'cn' ? title : titleEn"
      :show-dialog="showDialog"
      :have-two-order-list="haveTwoOrderList"
      @dialogCallback="dialogCallback" />
  </div>
</template>
<script>
import { queryOrderInfo } from '@/api/workOrder';
import TipDialog from '../components/tipDialog';
import { mapState } from 'vuex';
import { throttle } from 'lodash';
export default {
  name: 'Search',
  components: {
    TipDialog
  },
  props: {
    searchContent: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        searchString: '',
        status: '',
      },
      showDialog: false,
      title: '提示',
      titleEn: 'Tips',
      haveTwoOrderList: [],
      // 存在两笔同名订单的时候存在
      tradeOrderNo: '',
      isConsult: false
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  // watch: {
  //   $route(to, from) {
  //     this.formData.searchString = ' ';
  //   }
  // },
  created() { },
  mounted() {
    if (this.$route.path.includes('inquirySheet')) {
      this.isConsult = true;
    } else {
      this.isConsult = false;
    }
  },
  methods: {
    clearTradeOrderNo() {
      this.tradeOrderNo = '';
    },
    onSearchForm() {
      // 输入框没有内容搜索不到
      console.log(this.formData, '1234567890this.formData');
      if (this.formData.searchString === '' || this.formData.searchString.trim() == '') {
        return;
      }
      this.$emit('searchContent', {
        type: 'show',
        content: {
          inputOrderNo: this.formData.searchString,
          tradeOrderNo: this.tradeOrderNo
        }
      });
      // 根据状态判断跳转页面
      const params = {
        inputOrderNo: this.formData.searchString,
        tradeOrderNo: this.tradeOrderNo
      };
      queryOrderInfo(params)
        .then(response => {
          if (response.data) {
            const result = response.data;
            const { code, data } = result;
            if (code === 'APPLY_SUCCESS') {
              // 存在两个同名订单
              if (data.orderInfoList && data.orderInfoList.length >= 2) {
                // 选择一笔订单
                this.showDialog = true;
                data.orderInfoList.map((v, index) => {
                  v.id = index;
                  v.choose = false;
                });
                this.haveTwoOrderList = data.orderInfoList;
                console.log(this.haveTwoOrderList, '两笔订单的情况');
              } else {
                // 只有一笔订单,进行页面切换
                this.showDialog = false;
                this.changeRouter(data);
              }
            }
          }
        }).catch(() => {
          if (this.formData.searchString === '') {
            this.$router.push({
              path: '/work-order/create',
              query: {}});
            return;
          }
        });
      // }
    },
    queryOrderThrottle: throttle(function() {
      this.onSearchForm();
    }, 900, { leading: false, trailing: true }),
    // 切换路由信息页
    changeRouter(data) {
      if (data) {
        if (this.formData.searchString === '') {
          this.$router.push({
            path: '/work-order/create',
            query: {}});
          return;
        }
        // 1、VA账户 isVaAccountNo = true
        if (data.isVaAccountNo) {
          this.$router.push({ path: '/work-order/va', query: {
            formNo: data.formNo,
            inputOrderNo: this.formData.searchString,
            tradeOrderNo: data.tradeOrderNo,
            problemType: 'VA',
            type: 'TRADE',
            merchantId: data.merchantId,
            isAgain: data.orderInfoList && data.orderInfoList.length >= 2
          }});
          return;
        }

        // 2、已创建工单 formNO有值
        if (data.formNo && data.orderInfoList.length && data.isExceptionOrder === false) {
          console.log('12345678', data.orderInfoList[0]);
          this.$router.push({
            path: '/work-order/existing',
            query: {
              formNo: data.formNo,
              orderInfoList: data.orderInfoList[0],
              inputOrderNo: this.formData.searchString,
              tradeOrderNo: data.tradeOrderNo,
              problemType: data.problemType,
              merchantId: data.merchantId,
              status: data.status,
            }
          });
          return;
        }

        // 3、未找到工单 formNO和orderInfoList都为空
        if (!data.formNO && data.orderInfoList && data.orderInfoList.length === 0) {
          this.$router.push({ path: '/work-order/question',
            query: {
              formNo: data.formNo,
              inputOrderNo: this.formData.searchString,
              tradeOrderNo: data.tradeOrderNo,
              problemType: 'OTHER',
              type: 'TRADE',
              merchantId: data.merchantId,
              isAgain: data.orderInfoList && data.orderInfoList.length >= 2
            }});
        }
        // 4、交易异常 isExceptionOrder=true
        if (!data.formNO && data.orderInfoList && data.orderInfoList.length && data.isExceptionOrder) {
          this.$router.push({
            path: '/work-order/systemCollects',
            query: {
              formNo: data.formNo,
              inputOrderNo: this.formData.searchString,
              tradeOrderNo: data.orderInfoList[0].tradeOrderNo || '',
              firstHintCn: data.firstHintCn,
              firstHintEn: data.firstHintEn,
              problemType: data.problemType,
              type: 'TRADE',
              isAgain: data.orderInfoList && data.orderInfoList.length >= 2,
              orderInfoList: data.orderInfoList[0],
              merchantId: data.merchantId,
            }
          });
          return;
        }

        // 5、已申请退款 formNO 没有值、orderInfoList有值、isExceptionOrder=false
        if (!data.formNO && data.orderInfoList && data.orderInfoList.length && data.isExceptionOrder === false) {
          this.$router.push({
            path: '/work-order/content',
            query: {
              formNo: data.formNo,
              inputOrderNo: this.formData.searchString,
              tradeOrderNo: data.tradeOrderNo,
              orderInfoList: data.orderInfoList[0],
              firstHintCn: data.firstHintCn,
              firstHintEn: data.firstHintEn,
              problemType: data.problemType,
              merchantId: data.merchantId,
              type: 'TRADE',
              isAgain: data.orderInfoList && data.orderInfoList.length >= 2,
              guessAskList: data.guessAskList.concat({
                secondHintCn: '其他',
                secondHintEn: 'Others',
                descriptionCn: '',
                descriptionEn: '',
              })
            }
          });
          return;
        }
      }
    },
    dialogCallback(data) {
      this.showDialog = false;
      if (data.type == 'ok') {
        this.tradeOrderNo = data.choose.tradeOrderNo || '';
        this.queryOrderThrottle();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.search-content {
  .header {
    width: 100%;
    height: 260px;
    background-color: #0D223F;
    // background-image: url('../../../assets/svg-icons/icons/bannen.svg');
    // background-image: url('/image/dashbord/dashboard-bg.png');
    background-size: cover;
    background-position: center;
    /* 可选，确保图像居中显示 */
    background-repeat: no-repeat;

    /* 确保图像不重复 */
    .header__title {
      padding-top: 55px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;

      :nth-child(1) {
        font-family: Poppins;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0px;
      }

      :nth-child(2) {
        padding-top: 10px;
        font-family: Poppins;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .search-content-from {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    text-align: left;

    .search-input {
      border-radius: 12;
      border: 1;
      width: 720px;
      background-color: #fff;
      border-radius: 12px;
      font-size: 20px;
      font-weight: 600;

      /deep/ .el-input__inner {
        line-height: 64px;
        font-weight: 400;
        padding: 10px 12px;
        height: 64px;
        padding: 0 120px 0 45px;
        border: none;
      }

      /deep/ .el-input__prefix {
        position: absolute;
        left: 10px;
        top: 2px;
        color: #c0c4cc;
        font-size: 24px;
      }

      /deep/ .el-input__suffix {
        position: absolute;
        left: 470px;
        top: 2px;
        color: #c0c4cc;
      }
    }

    .search-input-btn {
      width: 96px;
      height: 48px;
      border-radius: 12px;
      background-color: #0c71ff;
      text-align: center;
      line-height: 48px;
      color: #fff;
      font-family: Poppins;
      font-size: 16px;
      font-weight: 600;
      margin-left: -103px;
      margin-top: 8px;
      cursor: pointer;
    }
  }
}
</style>
