<template>
  <div class="other-question-content">
    <main class="main-question-content">
      <section>
        <header><span>{{ $t('workOrderInfo.guessWhatYouWantToAsk') }}</span><span class="red">*</span></header>
        <el-form :rules="language== 'cn' ? rules : rulesEn" :model="formLabel" label-width="200px" class="form-content">
          <!-- 顶部猜你想要 -->
          <div class="radio-select">
            <div>
              <el-form-item>
                <el-radio-group v-model="formLabel.status" @change="getStatusName(formLabel.status)">
                  <el-radio v-for="(item,index) in guessList" v-if="item.secondHintCn" :key="index" :label="index + 1">
                    {{ language === 'cn' ? item.secondHintCn : item.secondHintEn }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div>
              <section>
                <img class="icon-pc" src="../../../../public/image/merchant/device-message.png" alt="">
              </section>
            </div>
          </div>
          <!-- 中间选择材料 -->
          <div v-if="statusName == 'Others'" class="profile-upload">
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
                :on-exceed="handleExceed"
                :on-preview="handlePreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success="onUploadSuccess"
                :headers="reqHeaders"
                :action="uploadUrl()"
                :file-list="resultFileList"
                class="upload-files"
                accept=".png,.jpeg,.gif,.pdf,.jpg,.JPG"
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
          </div>
          <!-- 底部按钮 -->
          <div class="footer-main">
            <el-form-item>
              <div class="footer">
                <el-button @click="goBack">{{ $t('workOrderInfo.return') }}</el-button>
                <el-button type="primary" @click="submitThrottle">{{ $t('workOrderInfo.createConsultation') }}</el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </section>
    </main>
  </div>
</template>
<script>
import { workOrderUploadUlr } from '@/api/upload';
import { orderCreate } from '@/api/workOrder';
import { mapState } from 'vuex';
import { throttle } from 'lodash';
import { evaluateUpload } from '@/api/auth';

export default {
  name: 'GuessWhatYouWant',
  props: {
    guessList: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      acceptFileTypes: '.png,.jpeg,.gif,.pdf',
      resultFileList: [],
      labelPosition: 'top',
      formLabel: {
        list: '',
        desc: '',
        status: ''
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
      statusName: ''
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
        merchantId: this.info ? this.info.userId : '',
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
    async handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const items = clipboardData.items || [];
      if (items && items[items.length - 1].kind == 'file' && this.resultFileList && this.resultFileList.length >= 5) {
        this.$message.warning(this.$t('workOrderInfo.fileCount'));
        return;
      }
      if (clipboardData) {
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
    getStatusName(status) {
      console.log(status, this.guessList, this.guessList[status - 1].secondHintEn);
      this.statusName = this.guessList[status - 1].secondHintEn;
      // return this.guessList[status].secondHintEn;
    },
    handleExceed(files, fileList) {
      if (fileList && fileList.length == 5) {
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
      console.log('onUploadSuccess', response);
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
      // 必须选中
      if (this.formLabel.status) {
        // source | 0：商户平台 4:开发者中心, url默认不传为0：商户平台，开发者中心url会传platform 为 4
        const source = parseInt(window.localStorage.getItem('platform-work-order')) || 0;
        // 选择了其他，但是没有输入描述
        if (this.statusName == 'Others' && !this.formLabel.desc) {
          return;
        }
        const params = {
          'inputOrderNo': this.$route.query.inputOrderNo || '',
          'tradeOrderNo': this.$route.query?.orderInfoList?.tradeOrderNo || '',
          'isExceptionOrder': false,
          'isAgain': false,
          'type': this.$route.query.type || '',
          'merchantId': this.$route.query.merchantId || '',
          'problemType': this.$route.query.problemType || '',
          'fileInfo': this.statusName == 'Others' ? JSON.stringify(this.resultFileList) : '[]',
          'description': this.statusName == 'Others' ? this.formLabel.desc : '',
          'guessAskInfo': this.guessList.find((v, index) => {
            return index === this.formLabel.status - 1;
          }),
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
                  inputOrderNo: this.$route.query.inputOrderNo || '',
                  problemType: this.$route.query.problemType || '',
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
          });
      } else {
        this.tipMessage(this.$t('workOrderInfo.mustSelectAContent'));
      }
    },
  }
};
</script>

<style scoped lang="scss">
.other-question-content{
  width:900px;
  padding: 24px 24px 8px 24px;
  border-radius: 12px;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  /deep/ .el-upload-dragger .el-icon-upload{
    font-size: 0;
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
  .main-question-content{
    .red{
      color: red;
      margin-left:5px;
    }
    .form-content{
      position: relative;
      .radio-select{
        display: flex;
        justify-content: space-between;
      }
      .addMargin{
          margin-top: 20px;
      }
      .profile-upload{
        margin-top:10px;
        /deep/ .el-textarea .el-input__count {
            background: transparent;
        }
        /deep/ .el-form-item__content{
          margin-left: 0;
        }
        /deep/ .el-form-item__label{
          text-align: left;
        }
        .upload-files{
          .el-upload__tip{
            margin-top:-18px;
            color: rgba(157, 162, 167, 1);
          }
        }
        /deep/ .el-upload-dragger{
          border-radius: 12px;
          height: 100px;
          .el-upload__text{
            margin-top: -86px;
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
        /deep/ .el-textarea__inner{
          height: 100px;
          .el-input__count {
              background: transparent !important;
          }
        }
        /deep/ .el-upload-dragger, .el-textarea{
          width: 852px;
        }
        /deep/ .el-form-item:nth-of-type(2){
          margin-bottom: 0;
        }
      }
      .footer-main{
        position: absolute;
        right: 0;
        margin-right: -24px;
        margin-top: 30px;
      }
    }
    header{
      font-family: Poppins;
      font-size: 18px;
      font-weight: 600;
      color: #1B1D1F;
      margin-bottom: 18px;
    }
    .icon-text{
      font-family: Poppins;
      font-size: 14px;
      font-weight: 500;
      color: #0C71FF;
      cursor: pointer;
    }
    .icon-pc{
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-top:-70px;
    }
    .icon_notice{
      color: #0C71FF;
    }
    .other-quersion-text{
      margin-top:7px;
    }
    /deep/ .el-form-item__content{
      margin-left: 0px !important;
    }
    /deep/ .el-radio-group{
      display: flex;
      flex-direction: column;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins;
      font-size: 14px;
      .el-radio{
        margin-bottom: 12px;
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
