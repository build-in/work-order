<template>
  <div class="download-card">
    <!-- 图片与PDF格式 -->
    <file-preview v-if="isImageOrPDF(fileInfo.url)" :url="fileInfo.url" :name="fileInfo.name" />
    <!-- ZIP XSLS WAP 等格式 -->
    <div v-else class="other-type">
      <div><d2-icon-svg name="transaction" class="iconrefresh" /></div>
      <div class="file-name-other">{{ fileInfo.name }}</div>
    </div>
    <div @click="donwload(fileInfo.url, fileInfo.name)">
      <d2-icon name="import" class="iconimport" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FilePreview from '@/components/file-preview';
export default {
  name: 'downloadCard',
  components: {
    FilePreview
  },
  props: {
    fileInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    justPDF(str) {
      var strRegex = '(.pdf)$'; // 用于验证后缀是否是pdf
      var reg = new RegExp(strRegex);
      if (reg.test(str.toLowerCase())) {
        // console.log('是pdf')
        return true;
      } else {
        // console.log('不是pdf')
        return false;
      }
    },
    isImageOrPDF(filename) {
      // 获取文件的扩展名
      const extension = filename.split('.').pop().toLowerCase();
      // 常见的图片和 PDF 文件扩展名
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      const pdfExtensions = ['pdf'];
      // 检查文件扩展名是否在常见图片或 PDF 扩展名列表中
      return imageExtensions.includes(extension) || pdfExtensions.includes(extension);
    },
    donwload(fileUrl, fileName = '') {
      axios({
        method: 'get',
        url: fileUrl,
        responseType: 'blob',
      }).then((response) => {
        const link = document.createElement('a');
        const blob = new Blob([response.data], { type: response.data.type });
        const urlRef = window.URL.createObjectURL(blob);
        link.href = urlRef;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(urlRef);
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.download-card{
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed rgba(234, 234, 234, 1);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  width: 235px;
  justify-content: space-between;
  color: rgba(114, 120, 128, 1);
  .file-name{
    width: 136px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }
  .file-name-other{
    width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    margin-left: 5px;
  }
  .type-img{
    display: flex;
  }
  .type-pdf{
    display: flex;
  }
  .iconrefresh, .iconimport{
    width: 24px !important;
    height: 24px !important;
  }
  .other-type{
    display: flex;
    align-items: center;
    cursor: default;
  }
}
</style>
