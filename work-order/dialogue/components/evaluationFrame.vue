<template>
  <div class="evaluation-frame-content">
    <el-dialog
      :show-close="true"
      :visible.sync="showDialog"
      :close-on-click-modal="true"
      filterable
      @close="handleClose()">
      <!-- 定制头部 -->
      <div slot="title" class="dialog-title">
        {{ title }}
      </div>
      <el-form ref="evaluationForm" :model="evaForm" :inline="true" class="demo-form-inline">
        <el-form-item lable-width="0">
          <el-input
            v-model="evaForm.evaText"
            :placeholder="$t(`workOrderInfo.pleaseEnterYourReview`)"
            type="textarea"
            maxlength="200"
            show-word-limit />
        </el-form-item>
      </el-form>
      <!-- 定制底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">{{ $t('workOrderInfo.cancel') }}</el-button>
        <el-button type="primary" @click="onDialogOk()">{{ $t('workOrderInfo.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EvaluationFrame',
  props: {
    title: {
      type: String,
      default: '',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    dialogCallback: {
      type: Function,
      default: () => { },
    }
  },
  data() {
    return {
      zone: '',
      evaForm: {
        evaText: ''
      }
    };
  },
  methods: {
    resetFieldsForm() {
      this.evaForm.text = '';
    },
    handleClose() {
      this.$emit('dialogCallback', { type: 'close', val: {}});
      this.resetFieldsForm();
    },
    onDialogOk() {
      this.$emit('dialogCallback', { type: 'ok', val: {
        evaForm: this.evaForm
      }});
      // this.resetFieldsForm();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.evaluation-frame-content {
    width: 440px;
    border-radius: 4px;
    margin-top: 26px;
    .demo-form-inline{
      /deep/ .el-textarea .el-input__count {
            background: transparent;
      }
    }
    .dialog-title{
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 18px;
    }
    /deep/ .el-dialog {
        width: 480px;
        padding: 0 24px;
        height: 316px;
        border-radius: 12px;
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
            justify-content: end;
            padding: 0;
        }
        .el-textarea__inner{
          width: 432px;
          height: 148px !important;
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