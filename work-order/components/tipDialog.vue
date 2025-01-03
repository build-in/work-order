<template>
  <div class="tip-dialog-content">
    <el-dialog
      :show-close="true"
      :visible.sync="showDialog"
      :close-on-click-modal="true"
      filterable
      @close="handleClose()">
      <!-- 定制头部 -->
      <div slot="title" class="dialog-title">
        <d2-icon-svg name="warning-2lquestion" /> {{ $t('workOrderInfo.tips') }}
      </div>
      <div class="tip-desc">{{ $t('workOrderInfo.isAssociatedWithTwoOrders') }}</div>
      <div id="payCard">
        <div v-for="(item, index) in haveTwoOrderList" :key="index" @click="chooseCard(item,index)">
          <PayCard :item="item" />
        </div>
      </div>
      <!-- 定制底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancel()">{{ $t('workOrderInfo.cancel') }}</el-button>
        <el-button type="primary" @click="onDialogOk()">{{ $t('workOrderInfo.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PayCard from '../common/payCard';
export default {
  name: 'TipDialog',
  components: {
    PayCard
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    // dialogCallback: {
    //   type: Function,
    //   default: () => { }, undefined,
    // },
    haveTwoOrderList: {
      type: Array,
      default: () => { },
    },
  },
  data() {
    return {
      zone: '',
      items: [{
        id: 0,
        country: '美国',
        status: '交易失败',
        money: '232.12 USD',
        time: 'yyyy-mm-dd hh:mm:ss',
        choose: false
      }, {
        id: 1,
        country: '日本',
        status: '交易失败',
        money: '232.12 USD',
        time: 'yyyy-mm-dd hh:mm:ss',
        choose: false
      }],
      chooseItem: {}
    };
  },
  methods: {
    handleClose() {
      this.$emit('dialogCallback', { type: 'close' });
    },
    onDialogCancel() {
      this.$emit('dialogCallback', { type: 'cancel' });
    },
    onDialogOk() {
      this.$emit('dialogCallback', { type: 'ok', choose: this.chooseItem || {} });
    },
    chooseCard(item, index) {
      this.chooseItem = item;

      // 更新当前列表数据
      this.haveTwoOrderList.find((v) => {
        if (v.id === index) {
          v.choose = true;
        } else {
          v.choose = false;
        }
      });
      console.log(item, index, this.haveTwoOrderList, 'this.haveTwoOrderList');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.show-dialog-zone {
    width: 440px;
    border-radius: 4px;
    margin-top: 26px;
    .tip-desc{
      color: rgba(0, 0, 0, 1);
      font-family: Poppins;
      font-size: 14px;
    }

    /deep/ .el-dialog {
        width: 480px;
        height: 416px;
        border-radius: 4px;
        .el-dialog__title {
            line-height: 30px;
            color: rgba(27, 29, 31, 1);
            font-family: Poppins-SemiBold;
            font-size: 18px;
        }
        .el-dialog__header{
            padding: 24px 0 26px 0;
        }
        .el-dialog__body {
            word-break: break-all;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .el-dialog__footer {
            display: flex;
            justify-content: center;
            padding: 0;
            margin-top: 24px;
        }
    }

    /deep/ .el-button{
        height:40px;
        border-radius: 12px;
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
    }
}
</style>