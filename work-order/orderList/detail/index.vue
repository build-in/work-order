<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      :destroy-on-close="true"
      :size="720"
      :title="$t('singleDisbursementManager.detailTitle')"
      direction="rtl"
      custom-class="report__drawer__custom"
      @close="onClose">
      <!--   TODO 部分内容增加骨架屏 -->
      <div class="content">
        <!--   出款关键信息   -->
        <div class="important-info">
          <!--    TODO 抽离组件    -->
          <descriptions :label="$t('singleDisbursementManager.payoutAmount')">
            <div class="payout-info">
              <country :show-country-name="false" :country-code="details.country" />
              <span class="amount">{{ $util.string.amountFormat(details.amount, details.currency, true) }}</span>
              <status-tag :status-options="$t('singleDisbursementManager.statusOption')" :status-value="details.status" :failure-reason="details.failureReason || ''" />
            </div>
          </descriptions>
          <el-row>
            <!--  订单号  -->
            <el-col :span="8">
              <descriptions :label="$t('singleDisbursementManager.orderId')">
                <button-copy :text="$util.string.betterDisplay(details.orderNo)" />
              </descriptions>
            </el-col>
            <!--  支付方式类型  -->
            <el-col :span="6">
              <descriptions :label="$t('singleDisbursementManager.paymentMethodType')">{{ $util.string.betterDisplay(details.paymentType) }}</descriptions>
            </el-col>
            <!--  支付方式  -->
            <el-col :span="6">
              <descriptions :label="$t('singleDisbursementManager.payMethod')">{{ $util.string.betterDisplay(details.paymentMethodName) }}</descriptions>
            </el-col>
          </el-row>

        </div>

        <!--   时间线   -->
        <detail-card-info :title="$t('singleDisbursementManager.timeline')">
          <timeline :time-lines="timeLines" :label="{cn: 'event', en: 'eventEn'}" :description="{cn: 'desc', en: 'descEn'}" time="time" />
          <el-link v-if="activities && activities.length > 1" :underline="false" type="primary" class="spread-btn" @click="onSpreadTimeline">
            {{ $t('singleDisbursementManager.actions.timeline') }}
            <i :class="['el-icon--right',isSpread ? 'el-icon-arrow-up' : 'el-icon-arrow-down' ]" />
          </el-link>
        </detail-card-info>
        <!--   出款信息   -->
        <detail-card-info :title="$t('singleDisbursementManager.payoutInfo')">
          <!--  商户号  -->
          <descriptions :label="$t('singleDisbursementManager.merchantNo')">
            <merchant-card :merchant-name="details.merchantName" :merchant-no="details.merchantNo" />
          </descriptions>

          <el-row :gutter="16">
            <!--  平台付款订单号  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.platformOrderNumber')">
                <button-copy :text="$util.string.betterDisplay(details.platformOrderNo)" />
              </descriptions>
            </el-col>

            <!--  批次号  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.batchNo')">
                {{ $util.string.betterDisplay(details.batchNo) }}
              </descriptions>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <!--  渠道订单号  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.channelOrderId')">
                {{ $util.string.betterDisplay(details.channelOrderNo) }}
              </descriptions>
            </el-col>

            <!--  出款金额  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.payoutAmount')">
                {{ $util.string.amountFormat(details.amount, details.currency, true) }}
              </descriptions>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <!--  支付方式类型  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.paymentMethodType')">
                {{ $util.string.betterDisplay(details.paymentType) }}
              </descriptions>
            </el-col>

            <!--  支付方式  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.payMethod')">
                {{ $util.string.betterDisplay(details.paymentMethodName) }}
              </descriptions>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <!--  国家/地区  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.distributeCountry')">
                <country :country-code="details.country" />
              </descriptions>
            </el-col>

            <!--  过期时间  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.expiredTime')">
                {{ $util.string.betterDisplay(details.expiryTime) }}
              </descriptions>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <!--  取款码  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.withdrawalCode')">
                {{ $util.string.betterDisplay(details.redeemCode) }}
              </descriptions>
            </el-col>

            <!--  附言  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.remark')">
                {{ $util.string.betterDisplay(details.remark) }}
              </descriptions>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <!--  二级商户标识  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.subMerchantNo')">
                {{ $util.string.betterDisplay(details.subMerchantNo) }}
              </descriptions>
            </el-col>
            <!--  付款目的  -->
            <el-col :span="12">
              <descriptions :label="$t('singleDisbursementManager.purpose')">
                {{ $util.string.betterDisplay(details.purpose) }}
              </descriptions>
            </el-col>
          </el-row>
        </detail-card-info>

        <!--   交易信息   -->
        <detail-card-info :title="$t('singleDisbursementManager.tradingInformation')">
          <!--    付款方    -->
          <div>
            <!--  付款方  -->
            <descriptions :label="$t('singleDisbursementManager.payer')">
              <merchant-card :merchant-name="details.payerName" />
            </descriptions>

            <div class="transaction">
              <!--  付款方汇出  -->
              <descriptions :label="$t('singleDisbursementManager.payerRemit')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payerAmount, details.payerCurrency, true) }}
              </descriptions>
              <!--  付款方手续费  -->
              <descriptions :label="$t('singleDisbursementManager.payerFee')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payerFee, details.payerFeeCurrency, true) }}
              </descriptions>
              <!--  付款方税费  -->
              <descriptions :label="$t('singleDisbursementManager.payerTax')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payerTax, details.payerTaxCurrency, true) }}
              </descriptions>
              <!--  汇率  -->
              <descriptions :label="$t('singleDisbursementManager.exchangeRate')" :font-weight="500" direction="horizontal">
                {{ payerRateDes }}
              </descriptions>
            </div>
          </div>

          <!--    收款方    -->
          <div>
            <!--  收款方  -->
            <descriptions :label="$t('singleDisbursementManager.payee')">
              <merchant-card :merchant-name="details.payeeName" :merchant-no="details.payeeAccountNo" icon-type="letter" />
            </descriptions>
            <div class="transaction">
              <!--  收款方收到  -->
              <descriptions :label="$t('singleDisbursementManager.beneficiaryReceived')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payeeAmount, details.payeeCurrency, true) }}
              </descriptions>

              <!--  收款方手续费  -->
              <descriptions :label="$t('singleDisbursementManager.payeeFee')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payeeFee, details.payeeFeeCurrency, true) }}
              </descriptions>

              <!--  收款方税费  -->
              <descriptions :label="$t('singleDisbursementManager.payeeTax')" :font-weight="500" direction="horizontal">
                {{ $util.string.amountFormat(details.payeeTax, details.payeeTaxCurrency, true) }}
              </descriptions>

              <!--  汇率  -->
              <descriptions :label="$t('singleDisbursementManager.exchangeRate')" :font-weight="500" direction="horizontal">
                {{ payeeRateDes }}
              </descriptions>

              <!--  银行编码  -->
              <descriptions :label="$t('singleDisbursementManager.IFSCode')" :font-weight="500" direction="horizontal">
                {{ $util.string.betterDisplay(details.payeeBankCode) }}
              </descriptions>

              <!--  目标机构/卡组  -->
              <descriptions :label="$t('singleDisbursementManager.targetOrg')" :font-weight="500" direction="horizontal">
                {{ $util.string.betterDisplay(details.targetOrg) }}
              </descriptions>
            </div>
          </div>
        </detail-card-info>
      </div>
      <footer class="drawer_footer">
        <div class="buttons">
          <el-button :loading="isDownLoading" type="primary" icon="iconfont icondirect-inbox" @click="openDownloadDialog">{{ $t('singleDisbursementManager.actions.credentialDownload') }}</el-button>
        </div>
      </footer>
    </el-drawer>

    <!-- 下载凭证 -->
    <mmcExportdataTimezone :visible.sync="downLoadingVisible" class="disbursement-certificate-download" @on-confirm="downLoadCertificate" />
  </div>
</template>
<script>
import { queryDisbursementDetailService, downloadSingleProofService } from '@/api/disbursement';
import Country from '@/components/country';
import MerchantCard from '@/components/merchant-card';
import mmcExportdataTimezone from '@/components/mmc-exportdata-timezone';
import ButtonCopy from '@/components/button-copy';
import Timeline from '../components/timeline.vue';
import DetailCardInfo from '../components/deatil-card-info.vue';
import Descriptions from '../components/Descriptions.vue';
import StatusTag from '../components/status-tag.vue';
import { mapGetters } from 'vuex';

export default {
  components: { DetailCardInfo, Descriptions, Country, MerchantCard, mmcExportdataTimezone, ButtonCopy, StatusTag, Timeline },
  data() {
    return {
      visible: false,
      downLoadingVisible: false,
      isLoading: false,
      isSpread: false,
      isDownLoading: false,
      currentRow: {},
      details: {},
      timeLines: [],
      activities: []
    };
  },
  computed: {
    ...mapGetters('d2admin/profile', [
      'language',
    ]),
    // 付款方汇率
    payerRateDes() {
      const { currency, payerDeductAmountCurrency, payerRate } = this.details;

      if (!currency || !payerDeductAmountCurrency || !payerRate) return '-';
      return `1 ${currency} = ${payerRate} ${payerDeductAmountCurrency}`;
    },
    // 收款方汇率
    payeeRateDes() {
      const { currency, payeeOrderAmountCurrency, payeeRate } = this.details;

      if (!currency || !payeeOrderAmountCurrency || !payeeRate) return '-';
      return `1 ${currency} = ${payeeRate} ${payeeOrderAmountCurrency}`;
    },
    statusMap() {
      return this.$t('singleDisbursementManager.statusOption')
        .find(item => item.value === this.details.status) || {};
    },
  },
  methods: {
    open(row = {}) {
      this.visible = true;
      this.currentRow = Object.assign({}, row);
      this.queryDetail();
    },
    queryDetail() {
      queryDisbursementDetailService({ indexId: this.currentRow.indexId })
        .then((response) => {
          const { paymentSingleDetailResp, timeLines } = (response.data || {}).data || {};
          this.details = Object.assign({}, paymentSingleDetailResp);
          // 存储源数据
          this.activities = timeLines || [];

          this.renderTimeLine();
        });
    },
    setTimelineWeight(list) {
      if (!list.length) return [];
      const { iconName, iconColor } = this.statusMap || {};
      const firstLineWeight = { icon: `iconfont ${iconName}`, color: iconColor };

      return list.map((item, idx) => {
        // 时间点降序排列，最新一条根据状态展示对应颜色的icon
        if (idx === 0) {
          return Object.assign({}, item, firstLineWeight);
        } else {
          return Object.assign({}, item, { color: '#9DA2A7' });
        }
      });
    },
    onSpreadTimeline() {
      this.isSpread = !this.isSpread;
      this.renderTimeLine();
    },
    renderTimeLine() {
      if (!this.activities || !this.activities.length) return;
      if (this.isSpread) {
        this.timeLines = this.setTimelineWeight(this.activities);
      } else {
        // 收起
        this.timeLines = [this.setTimelineWeight(this.activities)[0]];
      }
    },
    openDownloadDialog() {
      this.downLoadingVisible = true;
    },
    downLoadCertificate(selectTimeZone) {
      this.isDownLoading = true;
      const params = {
        timeZone: selectTimeZone,
        indexId: this.currentRow.indexId
      };
      downloadSingleProofService(params)
        .then((response) => {
          const result = (response.data || {}).data || {};
          if (result.fileData) {
            const blob = this.$util.downloadFileByBase64(result.fileData, 'application/pdf');
            // 浏览器下载到本地
            this.$util.downloadFileByUrl(blob, result.fileName);
          }
        })
        .finally(() => (this.isDownLoading = false));
    },
    onClose() {
      this.isSpread = false;
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  overflow-x: hidden;
  padding-right:6px;
  height: calc(100% - 88px);
  .important-info {
    border-bottom: 1px solid $color-neutral-light-100;
    padding-bottom: 24px;
  }
  /deep/.el-timeline {
    padding-left: 10px;
  }
}
.description-row {
  display: flex;
  width: 50%;
}
.amount {
  color: $color-neutral-light-500;
  font-feature-settings: 'clig' off, 'liga' off;

  /* Headline/Headline1-600 */
  font-family: Poppins;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 42px; /* 150% */
  margin-right:8px;
}
.payout-info {
  display: inline-flex;
  align-items: center;
}
.transaction {
  padding-left: 16px;
  border-left: 2px solid $color-neutral-light-100;
  margin-bottom: 32px;
  margin-top:16px;
}
.drawer_footer {
  .buttons {
    padding-right: 20px;
  }
}
.spread-btn {
  margin-left: 14px;
}

</style>
