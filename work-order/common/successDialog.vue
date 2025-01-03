<template>
  <div class="show-dialog-zone">
    <el-dialog
      :show-close="true"
      :visible.sync="showDialog"
      :title="title"
      :close-on-click-modal="true"
      filterable
      @close="handleClose()">
      <div class="dialog-image">
        <img src="https://img2.baidu.com/it/u=3294972975,2428297085&fm=253&fmt=auto&app=138&f=JPEG?w=320&h=320" alt="">
      </div>
      <div class="dialog-desc">
        您的工单已提交成功，我们会尽快为您处理
      </div>
      <div class="dialog-dedal">
        您可在“工单列表”-“工单详情”中，查看工单的处理状态。
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancel()">返回</el-button>
        <el-button type="primary" @click="onDialogOk()">查看工单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SuccessDialog',
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
    };
  },
  methods: {
    handleClose() {
      this.$emit('dialogCallback', { type: 'close', val: {}});
    },
    onDialogCancel() {
      this.$emit('dialogCallback', { type: 'cancel', val: {}});
    },
    onDialogOk() {
      this.$emit('dialogCallback', { type: 'ok', val: {}});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.show-dialog-zone {
    width: 440px;
    border-radius: 4px;
    margin-top: 26px;
    .dialog-image{
        img{
            width:106px;
            height: 106px;
            object-fit: cover;
        }
    }
    .dialog-desc{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins-SemiBold;
        font-size: 28px;
        line-height: 42px;
        text-align: center;
    }
    .dialog-dedal{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins;
        font-size: 16px;
        line-height: 24px;
        margin-top: 4px;
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