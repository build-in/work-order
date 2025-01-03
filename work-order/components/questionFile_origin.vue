<template>
  <div class="question-file-content">
    <section class="question-file-content-inner">
      <div class="problem-description-form">
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
              id="upload-files-preview"
              ref="uploadFileImage"
              v-model="formLabel.list"
              :limit="5"
              :headers="reqHeaders"
              :on-exceed="handleExceed"
              :on-preview="handlePreview"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-success="onUploadSuccess"
              :action="uploadUrl()"
              :file-list="resultFileList"
              :accept="UPLOAD_TYPE"
              class="upload-files"
              show-file-list
              list-type="picture"
              drag>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                <div><span class="left-space">{{ $t('workOrderInfo.tuozhuai') }}</span><span class="left-space">{{ $t('workOrderInfo.huo') }}</span><em style="margin-left:3px;">{{ $t('workOrderInfo.duanji') }}</em><span class="left-space">{{ $t('workOrderInfo.huo') }}</span><span class="left-space set-contanin">Ctrl</span><span class="left-space">+</span><span class="left-space set-contanin">V</span></div>
                <div slot="tip" class="el-upload__tip">{{ $t('workOrderInfo.supportedExtensions') }}</div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <div class="footer">
              <!-- <el-button @click="goBack">{{ $t('workOrderInfo.return') }}</el-button> -->
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
import { evaluateUpload } from '@/api/auth';
import { workOrderUploadUlr } from '@/api/upload';
// import { Loading } from 'element-ui';
import { throttle } from 'lodash';
import { UPLOAD_TYPE, IMAGE_UPLOAD_TYPE, DEFAULT_UPLOAD_IMAGE } from '../const/index';

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
      },
      clipboardData: null,
      UPLOAD_TYPE,
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
  mounted() {
    document.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.handlePaste);
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
    async handlePaste(event) {
      if (this.resultFileList && this.resultFileList.length >= 5) {
        this.$message.warning(this.$t('workOrderInfo.fileCount'));
        return;
      }
      const clipboardData = event.clipboardData || window.clipboardData;
      if (clipboardData) {
        const items = clipboardData.items;
        if (items && items.length > 0) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
              const file = item.getAsFile();
              const formData = new FormData();
              formData.append('file', file);
              if (file) {
                evaluateUpload(formData, {
                  token: this.$util.cookies.token,
                  userId: this.info ? this.info.userId : '',
                })
                  .then((response) => {
                    const { data, code } = response.data || {};
                    // 上传成功，应该返回
                    if (code === 'APPLY_SUCCESS') {
                      if (data) {
                        this.resultFileList.push({
                          url: data.url,
                          name: data.name,
                          uid: file.uid
                        });
                      }
                      console.log(this.resultFileList, '剪贴成功数据');
                    } else if (response && response.msg) { console.log('upload failed', response.msg); }
                  }).catch((error) => {
                    console.log(error);
                  });
              }
            }
          }
        }
      }
    },
    handleExceed(files, fileList) {
      if (fileList.length == 5) {
        this.$message.warning(this.$t('workOrderInfo.fileCount'));
      }
    },
    handlePreview(file) {
      // console.log(file,'12345678787878');
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 30;
      if (!isLt5M) {
        this.$message.error(this.$t('workOrderInfo.fileSize'));
      }
      return isLt5M;
    },
    goBack() {
      this.$router.push({ path: '/work-order/create' });
      var input = document.getElementById('clentSearchId');
      input.value = '';
    },
    uploadUrl() {
      return workOrderUploadUlr();
    },
    // onBeforeUpload(file) {
    //   // 上传之前判断文件格式是否正确
    //   console.log('onBeforeUpload', file);
    //   const isLt10M = file.size / 1024 / 1024 > 5;
    //   this.uploding = true;
    //   if (isLt10M) {
    //     this.uploding = false;
    //     this.$message.error(this.$t('workOrderInfo.fileSize'));
    //     return false;
    //   }

    //   const fileSuffixList = ['.jpg','.JPG', '.png', '.jpeg', '.gif', '.pdf'];
    //   const fileType = this.$util.getFileType(file);
    //   if (!fileSuffixList.includes(fileType)) {
    //     this.uploding = false;
    //     this.$message.error(this.$t('workOrderInfo.supportedExtensions'));
    //     return false;
    //   }

    //   return true;
    // },
    onUploadSuccess(response, file, fileList) {
      // 上传成功，应该返回
      if (response && response.code === 'APPLY_SUCCESS') {
        if (response.data) {
          this.resultFileList.push({
            url: response.data.url,
            name: response.data.name,
            uid: file.uid
          });
          this.dealPDF();
          setTimeout(() => {
            this.dealPDF();
          }, 1);
        }
        console.log(this.resultFileList, '上床成功数据');
      } else if (response && response.msg) { console.log('upload failed', response.msg); }
    },
    dealPDF() {
      const liElements = document.querySelectorAll('ul.el-upload-list.el-upload-list--picture li.el-upload-list__item');
      liElements.forEach(function(liElement) {
        const aElement = liElement.querySelector('a.el-upload-list__item-name');
        if (aElement && !IMAGE_UPLOAD_TYPE.some(subString => aElement.textContent.includes(subString))) {
          const imgElement = liElement.querySelector('img.el-upload-list__item-thumbnail');
          if (imgElement) {
            imgElement.src = DEFAULT_UPLOAD_IMAGE;
          }
        }
      });
    },
    handleRemove(file, fileList) {
      // 移除文件
      if (!file) {
        return;
      }
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
      const source = parseInt(window.localStorage.getItem('platform-work-order')) || 0;
      if (this.formLabel.desc) {
        const params = {
          'inputOrderNo': this.$route.query.inputOrderNo || '',
          'tradeOrderNo': this.$route.query.tradeOrderNo || '',
          'isExceptionOrder': false,
          'isAgain': this.$route.query.isAgain ? this.$route.query.isAgain : false,
          // 'type': this.$route.query.type || '',
          'type': 'CONSULT',
          'problemType': this.$route.query.problemType || '',
          'fileInfo': this.resultFileList ? JSON.stringify(this.resultFileList) : '[]',
          'description': this.formLabel.desc || '',
          'merchantId': this.$route.query.merchantId || '',
          source
        };

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
.question-file-content{
  display: flex;
  justify-content: center;
  width: 1020px;
  padding: 30px 30px 0px 30px;
  border-radius: 12px;
  background: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: -122px;
  padding-top: 30px;
  .question-file-content-inner{
    width:100%;
  }
  /deep/ .el-upload-dragger{
          border-radius: 12px;
          // .el-upload__text{
          //   margin-top: -15px;
          // }
          .el-upload__text{
            margin-top: -15px;
            .left-space{
              margin-left:3px;
              color: #727880;
            }
            .set-contanin{
              padding: 0px 3px 0px 3px;
              gap: 10px;
              border-radius: 4px 0px 0px 0px;
              background: #F8F8F8;
              color: #9DA2A7;
            }
          }
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
    width: 960px;
    height: auto;
  }
  /deep/ .el-upload-list{
    display: flex;
    align-items: center;
    .el-upload-list__item{
      width: 224px;
      margin-right: 8px;
      height: 56px;
      margin-top: 0px;
      .el-progress{
        right:5px;
      }
      .el-progress__text {
          position: absolute;
          right: 0;
          top: -31px;
      }
      &:last-child{
        margin-right: 0px;
      }
      .el-upload-list__item-thumbnail{
        height: 40px;
        width: 40px;
        border-radius: 8px;
        margin-top: -3px;
        object-fit: cover;
      }
      .el-icon-document{
        height: 40px;
        width: 40px;
        border-radius: 8px;
        margin-top: -3px;
        object-fit: cover;
      }
      .el-icon-document::before{
        height: 40px;
        width: 40px;
        border-radius: 8px;
        margin-top: -3px;
        object-fit: cover;
      }
      .el-upload-list__item-name {
          line-height: 37px;
          margin-top: 0;
      }
      .el-upload-list__item-name {
          color: #1a1c21;
          display: block;
          margin-right: 0px;
          overflow: hidden;
          padding-left: -16px;
          text-overflow: ellipsis;
          -webkit-transition: color .3s;
          transition: color .3s;
          white-space: nowrap;
          margin-left: -35px;
      }
      .el-upload-list__item-name i{
           font-size: 40px;
           top:13px;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: end;
    margin-top: 55px;
    position: absolute;
    right: 0;
    margin-right: -30px;
    margin-bottom: 10px;
  }
  /deep/ .el-textarea .el-input__count {
            background: transparent;
  }
  .upload-files {
    .el-upload__tip {
      margin-top: -18px;
      margin-bottom: 15px;
      color: rgba(157, 162, 167, 1);
    }
  }
}
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
      // width: 900px;
      // padding: 0px 30px;
      // border-radius: 12px;
      // background: rgba(248, 248, 248, 1);
      // box-sizing: border-box;

      .form-content {
        margin-top: -24px;
        /deep/ .el-form-item:nth-of-type(2) {
          margin-bottom: 0;
        }
        .addMargin{
          margin-top: 20px;
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
