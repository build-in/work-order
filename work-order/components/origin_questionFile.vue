<template>
  <div class="question-file-content">
    <section>
      <div class="problem-description-form">
        <div class="problem-description-header">
          <div class="problem-header-left">{{ title ? title : '' }}</div>
          <div class="problem-header-right">
            <img class="icon-pc" src="../../../../public/image/merchant/device-message.png" alt="">
          </div>
        </div>
        <el-form
          :label-position="labelPosition"
          :rules="language== 'cn' ? rules : rulesEn"
          :model="formLabel"
          label-width="200px"
          class="form-content">
          <el-form-item :label="$t(`workOrderInfo.problemDescription`)" prop="desc">
            <el-input
              v-model="formLabel.desc"
              :placeholder="$t(`workOrderInfo.pleaseDescribeYourIssue`)"
              type="textarea"
              maxlength="200"
              show-word-limit />
          </el-form-item>
          <el-form-item :label="$t(`workOrderInfo.relevantAttachments`)" prop="list" class="addMargin">
            <el-upload
              v-model="formLabel.list"
              :limit="5"
              :headers="reqHeaders"
              :on-exceed="handleExceed"
              :on-preview="handlePreview"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-success="onUploadSuccess"
              :action="uploadUrl()"
              class="upload-files"
              accept=".png,.jpeg,.gif,.pdf"
              show-file-list
              drag>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                <div><em>{{ $t('workOrderInfo.dragAndDropFilesHereOrClickUpload') }}</em></div>
                <div slot="tip" class="el-upload__tip">{{ $t('workOrderInfo.supportedExtensions') }}</div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <div class="footer">
              <el-button @click="goBack">{{ $t('workOrderInfo.return') }}</el-button>
              <el-button type="primary" @click="submitThrottle">{{ $t('workOrderInfo.createConsultation') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { orderCreate } from '@/api/workOrder';
import { workOrderUploadUlr } from '@/api/upload';
// import { Loading } from 'element-ui';
import { throttle } from 'lodash';

export default {
  name: 'QuestionFile',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      acceptFileTypes: '.png,.jpeg,.gif,.pdf',
      loading: false,
      uploding: false,
      resultFileList: [],
      labelPosition: 'top',
      formLabel: {
        list: '',
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          { min: 1, max: 200, message: '请输入不超过1~200个字符', trigger: 'blur' }
        ],
      },
      rulesEn: {
        desc: [
          { required: true, message: 'Please enter a description of the problem', trigger: 'blur' },
          { min: 1, max: 200, message: 'Please enter a maximum of 1 to 200 characters', trigger: 'blur' }
        ],
      },
      // loadingInstance: null,
      options: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(256,256,256,.7)',
        target: document.querySelector('.content')
      }
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
      'selectMerchant',
      'platformTimezone',
    ]),
    ...mapState('d2admin/user', [
      'info',
    ]),
    reqHeaders() {
      return {
        token: this.$util.cookies.token,
        userId: this.info ? this.info.userId : '',
      };
    },
  },
  watch: {
  },
  created() {
  },
  methods: {
    // showLoading() {
    //   this.loadingInstance = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(256,256,256,.7)',
    //     target: document.querySelector('.content')
    //   });
    // },
    handleExceed(files, fileList) {
      if (fileList.length == 5) {
        this.$message.warning(this.$t('workOrderInfo.fileCount'));
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error(this.$t('workOrderInfo.fileSize'));
      }
      return isLt5M;
    },
    goBack() {
      this.$router.push({ path: '/work-order/create' });
      var input = document.getElementById('clentSearchId');
      console.log(input, 'inputinputinputinputinput');
      input.value = '';
    },
    uploadUrl() {
      return workOrderUploadUlr();
    },
    onBeforeUpload(file) {
      // 上传之前判断文件格式是否正确
      console.log('onBeforeUpload', file);
      const isLt10M = file.size / 1024 / 1024 > 5;
      this.uploding = true;
      if (isLt10M) {
        this.uploding = false;
        this.$message.error(this.$t('workOrderInfo.fileSize'));
        return false;
      }

      const fileSuffixList = ['.png', '.jpeg', '.gif', '.pdf'];
      const fileType = this.$util.getFileType(file);
      if (!fileSuffixList.includes(fileType)) {
        this.uploding = false;
        this.$message.error(this.$t('workOrderInfo.supportedExtensions'));
        return false;
      }

      return true;
    },
    onUploadSuccess(response, file, fileList) {
      // 上传成功，应该返回
      if (response && response.code === 'APPLY_SUCCESS') {
        if (response.data) {
          this.resultFileList.push({
            url: response.data.url,
            name: response.data.name,
            uid: file.uid
          });
        }
      } else if (response && response.msg) { console.log('upload failed', response.msg); }
    },
    handleRemove(file, fileList) {
      // 移除文件
      if (!file) {
        return;
      }
      console.log('onUploadRemove', file, fileList);
      const index = this.resultFileList.findIndex(item => item.uid === file.uid);
      this.resultFileList.splice(index, 1);
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
      // Loading.service(this.options);
      // source | 0：商户平台 4:开发者中心, url默认不传为0：商户平台，开发者中心url会传platform 为 4
      const source = parseInt(window.localStorage.getItem('platform-work-order')) || 0;
      if (this.formLabel.desc) {
        const params = {
          'inputOrderNo': this.$route.query.inputOrderNo || '',
          'tradeOrderNo': this.$route.query.tradeOrderNo || '',
          'isExceptionOrder': false,
          'isAgain': this.$route.query.isAgain ? this.$route.query.isAgain : false,
          'type': this.$route.query.type || '',
          'problemType': this.$route.query.problemType || '',
          'fileInfo': this.resultFileList ? JSON.stringify(this.resultFileList) : '[]',
          'description': this.formLabel.desc || '',
          'merchantId': this.$route.query.merchantId || '',
          source
        };
        console.log(params, 'paramsparams');
        orderCreate(params)
          .then((response) => {
            const { data, code } = response.data || {};
            if (code === 'APPLY_SUCCESS' && data && data.formNo) {
              this.$router.push({
                path: '/work-order/dialogue',
                query: {
                  formNo: data.formNo,
                  type: this.$route.query.type || '',
                  problemType: this.$route.query.problemType || '',
                  inputOrderNo: this.$route.query.inputOrderNo || '',
                }
              });
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
          }).finally(() => {
            // this.loadingInstance.close();
          });
      } else {
        this.tipMessage(this.$t('workOrderInfo.descriptionOfTheProblem'));
      }
    },
  }
};
</script>

<style scoped lang="scss">
.problem-description-content {
  .problem-description {
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    header {
      width: 900px;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
    }

    .divider-line {
      margin-top: 24px;
      margin-bottom: 32px;
    }

    .problem-description-form {
      width: 900px;
      // height: 580px;
      padding: 0px 30px;
      border-radius: 12px;
      background: rgba(248, 248, 248, 1);
      box-sizing: border-box;

      .form-content {
        margin-top: -24px;
        /deep/ .el-form-item:nth-of-type(2) {
          margin-bottom: 0;
        }
        .addMargin{
          margin-top: 20px;
        }
        /deep/ .el-textarea .el-input__count {
            background: transparent;
        }
      }

      .problem-description-header {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;

        .problem-header-left {
          color: rgba(27, 29, 31, 1);
          font-family: Poppins-SemiBold;
          font-size: 18px;
          font-weight: 600;
        }

        .icon-pc {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }
      }

      .upload-files {
        .el-upload__tip {
          margin-top: -18px;
          color: rgba(157, 162, 167, 1);
        }
      }
      /deep/ .el-upload-dragger{
          border-radius: 12px;
      }

      /deep/ .el-button {
        font-family: Poppins;
        font-weight: 500;
        height: 40px;
        font-size: 14px;
        border-radius: 12px;
      }

      /deep/ .el-textarea__inner {
        height: 100px;

        .el-input__count {
          background: transparent !important;
        }
      }

      /deep/ .el-upload-dragger {
        width: 840px;
      }
    }

    .footer {
      display: flex;
      justify-content: end;
      position: absolute;
      right: 0;
      margin-right: -30px;
      margin-top: 40px;
      padding-bottom: 30px;
    }
  }
}
</style>
