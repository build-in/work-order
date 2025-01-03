<template>
  <div class="payment-wrapper">
    <TopFourCard :overview-data="overviewData" />
    <div class="search-table">
      <div class="form-container">
        <el-form ref="searchForm" :inline="true" :model="formData">
          <el-row type="flex" justify="space-between">
            <el-col :span="19">
              <!--  模糊搜索  -->
              <el-form-item prop="searchString">
                <el-input
                  v-model="formData.searchString"
                  :placeholder="$t(`workOrderInfo.pleaseEnteOrderNumber`)"
                  :class="[language == 'cn'? 'search-input' : 'search-input-en']"
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="queryOrderThrottle"
                  @input.native="queryOrderThrottle" />
              </el-form-item>
            </el-col>
            <!--  刷新 + 钉钉 + 创建工单  -->
            <el-col :span="4" class="icon-collect">
              <el-tooltip :content="$t(`workOrderInfo.reset`)" placement="top-end">
                <el-button class="iconfont iconiconreceipt" @click="onResetForm" />
              </el-tooltip>
              <el-tooltip :content="$t(`workOrderInfo.nailItAllTogether`)" placement="top-end">
                <el-button class="iconfont iconflash" @click="nailPeople('')" />
              </el-tooltip>
              <el-button type="primary" @click="createWorkOrder">
                <span class="createWorkOrderBtn"><i class="iconfont iconadd" /></span>
                <span>{{ $t('workOrderInfo.createConsultation') }}</span>
              </el-button>
            </el-col>
          </el-row>
          <el-row style="display: flex;">
            <!--  工单类型筛选  -->
            <!-- <el-form-item :style="language == 'cn'? 'width:116px' :' width:125px'" prop="type">
              <el-select v-model="formData.type" :placeholder="$t(`workOrderInfo.workOrderType`)" clearable @change="updateTable">
                <el-option v-for="(item) in typeList" :label="language === 'cn' ? item.label : item.labelEn" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item> -->
            <!--  时间筛选  -->
            <!-- <el-form-item :style="language == 'cn'? 'width:116px' :' width:155px'" prop="type">
              <el-select v-model="formData.time" :placeholder="$t(`workOrderInfo.workOrderTime`)" clearable @change="updateTable">
                <el-option v-for="(item) in timeList" :label="language === 'cn' ? item.label : item.labelEn" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item> -->
            <!--  工单状态筛选  -->
            <el-form-item :style="language == 'cn'? 'width:116px' :' width:125px'" prop="status">
              <el-select v-model="formData.status" :placeholder="$t(`workOrderInfo.workOrderStatus`)" clearable @change="updateTable">
                <el-option v-for="(item) in orderList" :label="language === 'cn' ? item.label : item.labelEn" :value="item.value" :key="item.value" />
              </el-select>
            </el-form-item>
            <!--  创建人筛选  -->
            <el-form-item :style="language == 'cn'? 'width:116px' :' width:125px'" prop="status">
              <el-input
                v-model="formData.creator"
                :placeholder="$t(`workOrderInfo.creator`)"
                :class="['search-input-creator']"
                clearable
                @clear="queryOrderThrottle"
                @input.native="queryOrderThrottle" />
            </el-form-item>
            <!-- 创建时间 -->
            <el-form-item :style="language == 'cn'? 'marginLeft:124px' :'marginLeft:118px'" class="timepick-width-prepend">
              <div class="timepick-width-prepend">
                <div slot="label">
                  <el-select v-model="formData.timeType" :style="language == 'cn'? 'width:116px' :' width:155px'" class="prepend-text" @change="updateTable">
                    <el-option v-for="(item) in timeNewList" :label="language === 'cn' ? item.label : item.labelEn" :value="item.value" :key="item.value" />
                  </el-select>
                </div>
                <MMCPicker
                  :start-time.sync="startTime"
                  :end-time.sync="endTime"
                  type="datetimerange"
                  class="prepend-data-picker"
                  clearable
                  @change="updateTable" />
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!-- 列表展示 -->
      <sp-table
        ref="table"
        v-bind="table"
        :request-params-fun="getQueryParams"
        row-class-name="row-class"
        @update="onSearch"
        @row-click="onRowClick" />
    </div>
    <!--  详情页  -->
    <detail-drawer ref="details" />
  </div>

</template>

<script>
import { throttle } from 'lodash';
import { mapState, mapGetters } from 'vuex';
import commonMixin from '@/minxs';
import DetailDrawer from '../detail';

import { getList, overview, urgentApply } from '@/api/workOrder';
import { paymentSearchColumns as columns } from '../columns';
import TopFourCard from '../components/topFourCard.vue';
import MMCPicker from '@/components/Date/rangePicker';

export default {
  components: { DetailDrawer, TopFourCard, MMCPicker },
  mixins: [...commonMixin],
  data() {
    return {
      currentRow: {},
      formData: {
        searchString: '',
        status: '',
        type: '',
        timeType: 'CREATE_TIME',
        finishStartTime: '',
        finishEndTime: '',
        creator: ''
      },
      startTime: this.getDefaultDate().startDate,
      endTime: this.getDefaultDate().endDate,
      table: {
        columns,
        data: [],
        loading: false,
        showPagination: true,
        layout: 'total,sizes, prev, pager, next',
      },
      typeList: [{
        value: 'TRADE',
        label: '交易问题',
        labelEn: 'Transaction question'
      }, {
        value: 'CONSULT',
        label: '咨询问题',
        labelEn: 'Consulting question'
      }],
      orderList: [{
        value: 'PROCESS',
        label: '处理中',
        labelEn: 'In progress'
      }, {
        value: 'FINISHED',
        label: '已完成',
        labelEn: 'Completed'
      }],
      timeList: [{
        value: 'startTime',
        label: '创建时间',
        labelEn: 'Create Time',
      }, {
        value: 'endTime',
        label: '完成时间',
        labelEn: 'Completion Time',
      }],
      timeNewList: [{
        value: 'CREATE_TIME',
        label: '创建时间',
        labelEn: 'Create Time',
      }, {
        value: 'COMPLETE_TIME',
        label: '完成时间',
        labelEn: 'Completion Time',
      }],
      overviewData: {},
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'platformTimezone',
    ]),
    ...mapGetters('d2admin', {
      platformTimezoneGetter: 'profile/platformTimezoneGetter',
      systemOffset: 'systemVar/timezoneOffset',
    }),
  },
  created() {
    this.getOrderProcess();
  },
  methods: {
    // 设置默认时间为上个月
    getDefaultDate() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate() + 1;
      return {
        'startDate': new Date(y, m, d - 30, 0, 0, 0),
        'endDate': new Date(y, m, d, 0, 0, 0),
      };
    },
    // 更新列表数据
    updateTable(pageNum = 1) {
      return this.$refs.table && this.$refs.table.updateDrive(pageNum);
    },
    getQueryParams(payload = {}) {
      const timezone = this.systemOffset;
      if (this.formData.timeType === 'CREATE_TIME' && this.startTime !== null) {
        this.formData.startTime = this.$util.toUTCTime(this.startTime, timezone);
        this.formData.endTime = this.$util.toUTCTime(this.endTime, timezone);
        this.formData.finishStartTime = null;
        this.formData.finishEndTime = null;
      }
      if (this.formData.timeType === 'COMPLETE_TIME') {
        this.formData.finishStartTime = this.$util.toUTCTime(this.startTime, timezone);
        this.formData.finishEndTime = this.$util.toUTCTime(this.endTime, timezone);
        this.formData.startTime = null;
        this.formData.endTime = null;
      }
      const params = Object.assign({}, payload, this.formData);
      console.log(params, 'paramsparamsparamsparamsparamsparamsparams');
      return params;
    },
    // 列表搜索
    onSearch(params) {
      this.table.loading = true;
      getList(params)
        .then((response) => {
          const result = (response.data || {}).data || {};
          this.table.data = result.rows || [];
          this.table.total = result.total || 0;
        })
        .finally(() => (this.table.loading = false));
    },
    // 工单、订单 模糊搜索
    queryOrderThrottle: throttle(function() {
      this.updateTable();
    }, 1000, { leading: false, trailing: true }),
    // 刷新，重置表单
    onResetForm() {
      this.$refs.searchForm.resetFields();
      this.startTime = '';
      this.endTime = '';
      this.updateTable(1);
    },
    // 钉一下人
    nailPeople(formNo = '') {
      const params = {
        formNo: formNo
      };
      urgentApply(params)
        .then(response => {
          const result = response.data || {};
          const { code } = result;
          if (code) {
            this.tipMessage(this.$t('workOrderInfo.internalExpeditedProcessing'));
          }
        })
        .catch((error) => {
          const { data } = error || {};
          switch (data.code) {
            case 'WORK_ORDER_IS_URGED':
              if (formNo) {
                this.tipMessage(this.$t('workOrderInfo.internalExpeditedProcessing'));
              } else {
                this.tipMessage(this.$t('workOrderInfo.withinTheNormalProcessingTimeFrame'));
              }
              break;
            case 'NOT_EXIST_PROCESS_WORK_ORDER':
              this.tipMessage(this.$t('workOrderInfo.ordersBeingProcessedInTheList'));
              break;
            case 'WORK_ORDER_ALREADY_EXISTS':
              this.tipMessage(this.$t('workOrderInfo.orderExisting'));
              break;
            default:
              break;
          }
        });
    },
    tipMessage(message) {
      this.$message({
        message: message,
        type: 'success'
      });
    },
    // 顶部四个卡片
    getOrderProcess() {
      const params = {
        timezone: Number(this.systemOffset || 0)
      };
      overview(params)
        .then(response => {
          const result = response.data || {};
          const { code, data } = result;
          if (code === 'APPLY_SUCCESS') {
            this.overviewData = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onRowClick(row, column) {
      if (column?.property === 'action') return;
      const { formNo, inputOrderNo, problemType, tradeOrderNo, type, status, creator, description } = row;
      if (formNo) {
        this.$router.push({
          path: '/work-order/dialogue',
          query: {
            formNo,
            inputOrderNo,
            problemType,
            tradeOrderNo,
            type,
            status,
            creator,
            description
          }});
      }
    },
    // table操作的操作按钮
    onCommand(action, row) {
      switch (action) {
        case 'CUI':
          this.currentRow = Object.assign({}, row);
          this.nailPeople(row.formNo);
          console.log('催一下，哈哈哈');
          break;
        default:
          console.error('onCommand error', action);
      }
    },
    openDetail(row) {
      this.$refs.details && this.$refs.details.open(row);
    },
    createWorkOrder() {
      this.$router.push({ path: '/work-order/create' });
    }
  }
};
</script>

<style scoped lang="scss">
.payment-wrapper {
  padding: 24px 30px 0 30px;

  .search-table {
    margin: 24px 0;
  }

  .search-input {
    width: 480px;
  }
  .search-input-en{
    width: 680px;
  }
  .search-input-creator {
    width: 241px;
  }
  .search-input-en-creator{
    width: 241px;
  }

  /deep/.el-table {
    margin-bottom: 64px;
  }

  .form-container {
    /deep/ .multiple-select-search-wrap {
      .el-form-item__label {
        max-width: 150px;
        padding-right: 0;

        .is-focus .el-input__inner {
          // border-color: transparent;
        }

        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          // border-right-color: transparent;
          background: rgba(0, 0, 0, 0.02);
        }
      }

      .mmc-date-picker {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 230px;
      }
    }
    .prepend-text{
     /deep/ .el-input__inner{
        border-top-right-radius:0px !important;
        border-bottom-right-radius:0px !important;
      }
    }
    .timepick-width-prepend {
      display: flex;
      align-items: center;
      .el-input__inner {
        border-top-left-radius:0px !important;
        border-bottom-left-radius:0px !important;
      }
    }
    .customer-select-merchant {
      min-width: 270px;
    }

    .icon-collect {
      display: flex;
      justify-content: end;
      align-items: center;
      .createWorkOrderBtn{
        display: inline-block;
      }

      .iconrefresh,
      .iconfont {
        width: 40px;
        justify-content: center;
        display: flex;
        align-items: center;
      }
      .iconadd{
        width: 25px !important;
      }
    }

  }

  .custom_checkbox {
    display: flex;
    align-items: center;

    /deep/ .el-checkbox__label {
      width: 100%;
    }
  }
  /deep/ .sp-pagination-container .el-pagination__total {
      position: absolute;
      left: 0 !important;
      margin-left: 45px !important;
  }
}
</style>
