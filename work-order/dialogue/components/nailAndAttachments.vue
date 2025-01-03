<template>
  <div class="nail-and-attachments">
    <!-- 顶部 催一下 + 结束服务 -->
    <div class="common-card">
      <div class="desc">
        <div class="data-list">
          <div v-for="(item, index) in list" :key="index" class="data-list-item">
            <div class="data-list-content" @click="tapBtn(item)">
              <d2-icon :name="`${item.iconName}`" :class="`icon${item.iconName}`" />
              <div>{{ language === 'cn' ? item.name : item.enName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传附件 -->
    <el-form ref="form" :model="diaForm" label-width="200px" class="form-content">
      <!-- 中间选择材料 -->
      <div class="profile-upload">
        <el-form-item label-width="0">
          <el-input
            v-model="diaForm.desc"
            :placeholder="$t(`workOrderInfo.pleaseDescribeYourIssue`)"
            type="textarea"
            maxlength="3000"
            show-word-limit
            @keyup.enter.native.prevent="submitThrottle" />
        </el-form-item>
        <!-- 底部按钮 -->
        <div class="footer-main">
          <el-form-item>
            <div class="footer-blank" />
            <div class="footer-shortkey">
               {{ showShortcutKeys()}}
            </div>
            <div class="footer">
              <el-button type="primary" @click="submitThrottle">
                <!-- <d2-icon name="arrow-right" class="iconarrow-right" /> -->
                <span>
                  <img
                    :src="`${$baseUrl}image/merchant/Frame 1071.png`"
                    style="width:15px;"
                    alt="">
                </span>
                <span>
                  {{ $t('workOrderInfo.sendOut') }}
                </span>
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item label-width="0">
          <el-upload
            v-model="diaForm.list"
            :limit="5"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :headers="reqHeaders"
            :on-success="onUploadSuccess"
            :action="uploadUrl()"
            :file-list="resultFileList"
            :accept="UPLOAD_TYPE"
            list-type="picture"
            class="upload-files">
            <!-- <div class="upfile-btn-blank" /> -->
            <div class="upfile-btn">
              <d2-icon name="document-upload" class="document-upload" />
              <div>{{ $t('workOrderInfo.uploadAttachments') }}</div>
            </div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { workOrderUploadUlr } from '@/api/upload';
import { saveContactInfo, orderUpdate, urgentApply } from '@/api/workOrder';
import { throttle } from 'lodash';
import { evaluateUpload } from '@/api/auth';
import { UPLOAD_TYPE, IMAGE_UPLOAD_TYPE, DEFAULT_UPLOAD_IMAGE } from '../../const/index';
export default {
  name: 'NailAndAttachments',
  components: {},
  props: {
    updateHistory: {
      type: Function,
      default: () => { }
    },
    onlyUpdateChatHistory: {
      type: Function,
      default: () => { }
    },
  },
  data() {
    return {
      list: [
        {
          name: '催一下',
          enName: 'Reminder',
          iconName: 'flash'
        },
        {
          name: '结束服务',
          enName: 'End Service',
          iconName: 'read'
        },
      ],
      diaForm: {
        desc: '',
        list: [],
      },
      resultFileList: [],
      UPLOAD_TYPE,
      inStatus:false,
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
    document.addEventListener('keydown', this.handleGlobalKeydown);
    document.addEventListener('compositionstart', this.handleCompositionstart);
    document.addEventListener('compositionend', this.handleCompositionend);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.handlePaste);
    document.removeEventListener('keydown', this.handleGlobalKeydown);
    document.removeEventListener('compositionstart', this.handleCompositionstart);
    document.removeEventListener('compositionend', this.handleCompositionend);
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
    handleGlobalKeydown(event) {
      // 1、检测用户是否正在使用输入法（IME）进行输入, 在IME输入过程中，我们可以禁用Enter键的发送行为。但是，这需要在IME输入结束时重新启用它，这可能会带来一些用户体验上的问题;
      // 2、延迟发送逻辑：按下Enter键时不立即发送消息，而是设置一个短暂的延迟，检查是否有IME的compositionend事件被触发。如果没有，那么可以认为用户不是在IME输入过程中，此时可以发送消息。
      if (event.key === 'Enter' || event.keyCode == 13) {
          // Disable line feed
          event.preventDefault();
          if(this.inStatus){
             // Forbid sending
            event.preventDefault();
            return;
          }
      }

      // if (event.ctrlKey) {
      //   event.preventDefault();
      // }

      // if (event.keyCode == 32 || event.key == "Space") {
      //   event.preventDefault();
      // }

      if ((event.metaKey && (event.key === 'Enter' || event.keyCode == 13)) || (event.ctrlKey && (event.key === 'Enter' || event.keyCode == 13))) {
        event.preventDefault();
        this.diaForm.desc += '\n';
      }
    },
    handleCompositionstart(event){
      this.inStatus = true;
    },
    handleCompositionend(event){
      setTimeout(()=>{
        this.inStatus = false;
      },810);
    },
    submitThrottle: throttle(function(event) {
      this.onSubmit(event);
    }, 300, { leading: false, trailing: true }),
    handleExceed(files, fileList) {
      if (fileList && fileList.length == 5) {
        this.$message.warning(this.$t('workOrderInfo.fileCount'));
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 30;
      if (!isLt5M) {
        this.$message.error(this.$t('workOrderInfo.fileSize'));
      }
      return isLt5M;
    },
    handleRemove(file, fileList) {
      // 移除文件
      if (!file) {
        return;
      }
      const index = this.resultFileList.findIndex(item => item.uid === file.uid);
      this.resultFileList.splice(index, 1);
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
          this.dealPDF();
          setTimeout(() => {
            this.dealPDF();
          }, 1);
        }
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
    uploadUrl() {
      return workOrderUploadUlr();
    },
    saveContentMethod() {
      const params = {
        formNo: this.$route.query.formNo,
        fileInfo: this.resultFileList ? JSON.stringify(this.resultFileList) : '[]',
        content: this.diaForm.desc,
        direction: 'M'
      };
      saveContactInfo(params)
        .then((response) => {
          const { code } = response.data || {};
          if (code === 'APPLY_SUCCESS') {
            // 需要更新工单记录
            this.$emit('onlyUpdateChatHistory');
            this.resetForm();
          }
        });
    },
    onSubmit(event) {
      console.log('click btn:', event.keyCode, 'event.keyCode',this.inStatus, 'this.inStatus',event.key,'event.key',event.ctrlKey, 'event.ctrlKey',event.metaKey,'event.metaKey');
      // Shortcut key
      if (event.key === 'Enter' || event.keyCode == 13) {
        // Disable the input method
        if(this.inStatus){
          event.preventDefault();
          return;
        }
        // Added line feed ability
        if (this.diaForm.desc && this.endsWithNewline(this.diaForm.desc) && this.resultFileList.length === 0) {
          if (this.diaForm.desc.trim().split('\n')[0] == '') {
            return;
          }
        }
      }
      // Button click
      if (!this.diaForm.desc.trim() && this.resultFileList.length === 0) {
        this.alertError();
        return;
      }

      // Disable the input method and click btn
      if(this.inStatus){
        event.preventDefault();
        return;
      }

      // Disable default behavior
      if ((event.metaKey && (event.key === 'Enter' || event.keyCode == 13)) || (event.ctrlKey && (event.key === 'Enter' || event.keyCode == 13))) {
        event.preventDefault();
      } else {
        this.saveContentMethod();
      }
    },
    detectOS() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/Windows NT/.test(userAgent)) {
        return 'Windows';
      }
      if (/Macintosh|Mac OS X/.test(userAgent)) {
        return 'Mac';
      }
      return 'Other';
    },
    alertError() {
      this.$message.warning(this.$t('workOrderInfo.descProm'));
    },
    endsWithNewline(s) {
      return /\n$/.test(s);
    },
    resetForm() {
      this.diaForm = {
        desc: '',
        list: [],
      };
      this.resultFileList = [];
    },
    tapBtn(item) {
      const status = item.iconName;
      switch (status) {
        case 'flash':
          this.nailPeople();
          break;
        case 'read':
          this.getOrderUpdate();
          break;
        default:
          break;
      }
    },
    getOrderUpdate: throttle(function() {
      const params = {
        formNo: this.$route.query.formNo || '',
        isResolved: '',
        status: 'FINISHED'
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
    }, 800, { leading: false, trailing: true }),
    // 钉一下人
    nailPeople: throttle(function() {
      urgentApply({
        formNo: this.$route.query.formNo || '',
      })
        .then(response => {
          const result = response.data || {};
          console.log(result, 'resultresult');
          const { code } = result;
          if (code) {
            this.tipMessage(this.$t('workOrderInfo.internalExpeditedProcessing'));
          }
        })
        .catch((error) => {
          const { data } = error || {};
          switch (data.code) {
            case 'WORK_ORDER_IS_URGED':
              if (this.$route.query.formNo) {
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
    }, 800, { leading: false, trailing: true }),
    tipMessage(message) {
      this.$message({
        message: message,
        type: 'success'
      });
    },
    showShortcutKeys(){
      if( 'Mac' === this.detectOS() ){
           return this.getWinShortcut('mac');
      }else{
           return this.getWinShortcut('win');
      }
    },
    getWinShortcut(name) {   
        for (const key of this.$t('workOrderInfo.shortcutKeys')) {  
            if (key.type === name) {  
                return key.text;  
            }  
        }  
        return null;
    },
  }
};
</script>

<style scoped lang="scss">
.nail-and-attachments {
  // padding: 0 30px;
  position: fixed;
  bottom: 0;
  background: transparent;
  width: calc(100vw - 402px);
  height: 230px;
  // background: white;

  .iconrefresh {
    width: 16px;
    height: 16px;
  }

  .common-card {
    // margin-top: 20px;
    // width: calc( 100vw - 468px);
    padding: 0 30px;
    .desc {
      color: rgba(27, 29, 31, 1);
      font-size: 14px;
      line-height: 21px;
      font-family: Poppins;

      .data-list {
        margin-top: 8px;
        margin-left: -8px;
        display: flex;
        flex-wrap: wrap;

        /* 允许换行 */
        .data-list-item {
          flex: 0 0 auto;
          /* 不增长、不缩小、基于内容的大小 */
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          margin-left: 8px;
          cursor: pointer;

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
            font-weight: 500;
            font-size: 12px;

            :nth-child(2) {
              margin-left: 3px;
            }
          }
        }
      }
    }
  }

  .form-content {
    padding: 16px 16px 16px;
    margin-bottom: -16px;
    background: rgba(255, 255, 255, 1);
    /deep/.el-textarea .el-input__count {
      color: #75757a;
      background: #fff;
      position: absolute;
      font-size: 12px;
      bottom: 2px;
      right: 96px;
      z-index: 99;
    }
    .profile-upload {
      /deep/ .el-textarea .el-input__count {
            background: transparent;
      }
      .upfile-btn {
        display: flex;
        position: absolute;
        top: 0;
        margin-top: -74px;
        left: 0;
        margin-left:16px;
        background: #fff;
        border-radius: 12px;
        padding: 0 6px;

        :nth-child(2) {
          color: rgba(114, 120, 128, 1);
          font-family: Poppins;
          font-weight: 500;
          font-size: 14px;
          margin-left:5px;
        }
      }
      .upfile-btn-blank{
        position: absolute;
        top: 0;
        margin-top: -74px;
        background: #fff;
        width: 100%;
        height: 41px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .upload-files {
        margin-top: -70px;

        .el-upload__tip {
          margin-top: -18px;
          color: rgba(157, 162, 167, 1);
        }

      }
      /deep/ .el-upload-dragger{
          border-radius: 12px;
      }

      /deep/ .el-textarea__inner {
        height: 155px;
        resize: none;
        padding-bottom: 40px;
      }
      /deep/ .el-upload-list {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: -85px;
        margin-left: 16px;
        .el-upload-list__item{
          margin-right:8px;
          .el-progress{
              right:5px;
          }
          .el-progress__text {
              position: absolute;
              right: 0;
              top: -10px;
          }
        }
        .el-upload-list__item-name{
          line-height: 21px;
          margin-top: 0;
        }
        .el-upload-list__item-thumbnail {
            vertical-align: middle;
            display: inline-block;
            width: 30px;
            height: 30px;
            object-fit: cover;
            float: left;
            position: relative;
            z-index: 1;
            margin-left: -80px;
            background-color: #fff;
            border-radius: 8px;
            margin-top: -6px;
        }
        .el-upload-list__item-name{
           margin-left: -43px;
        }
        .el-upload-list__item-name i{
           font-size: 30px;
           top:5px;
        }
      }
      /deep/ .el-upload-list li{
        width: 200px;
        height: 40px;
      }
      /deep/ .profile-upload{
        position: absolute;
        margin-top: -17px;
      }
    }

    .footer-main {
      position: relative;
      .footer-blank {
        position: absolute;
        top: -61px;
        right: 8px;
        width: 328px;
        height: 43px;
        background: #fff;
        border-radius: 12px;
      }
      .footer-shortkey{
        position: absolute;
        top: 0;
        margin-top: -59px;
        right: 0;
        margin-right: 155px;
        align-items: center;
        z-index: 99;
        color: #9da2a7;
      }
      .footer {
        display: flex;
        position: absolute;
        top: 0;
        margin-top: -59px;
        right: 0;
        margin-right: 8px;
        align-items: center;
        z-index: 99;

        .enter {
          display: flex;
          align-items: center;
        }
      }

      /deep/ .el-upload-list {
        position: absolute;
        top: -115px;
        display: flex;
        align-items: center;
      }
    }

  }
}
</style>