<template>
  <div class="test-copy">
    测试复制张贴上传
  </div>
</template>

<script>
import { workOrderUploadUlr } from '@/api/upload';
const _this = null;
export default {
  name: 'TestCopy',
  mounted() {
    document.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.handlePaste);
  },
  methods: {
    uploadUrl() {
      return workOrderUploadUlr();
    },
    handleSuccess(response, file, fileList) {
      // 成功处理逻辑
    },
    handleError(err, file, fileList) {
      // 错误处理逻辑
    },
    // 监听ctrl+v上传图片
    async pasteEvent(e) {
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
        const item = e.clipboardData.items[i];
        if (item.kind === 'file') {
          const file = await item.getAsFile();
          const reader = new FileReader();
          reader.onload = async() => {
            file.src = reader.result;
            // 拆分base64编码为标头和数据
            const parts = reader.result.split(';base64,');
            // 解析MIME类型
            const imageType = parts[0].split(':')[1];
            // 将Base64数据转为byte数组
            const byteCharacters = atob(parts[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // 创建Blob对象
            const imageBlob = new Blob([byteArray], { type: imageType });
            // 创建FormData对象
            const formData = new FormData();
            // 添加Blob对象到FormData对象
            formData.append('file', imageBlob);
            const imgRes = await _this.$request({
              method: 'post',
              url: '/a/b/c',
              data: formData,
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (imgRes.code == 0) {
              const image = new Image();
              image.src = imgRes.data.url;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      if (clipboardData) {
        const items = clipboardData.items;
        if (items && items.length > 0) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
              const file = item.getAsFile();
              console.log(file, '1234567686');
              if (file) {
                this.$refs.uploadFileImage.submit({ file });
              }
            }
          }
        }
      }
    }
  },
};
</script>
<style>
.test-copy{
  position: absolute;
  z-index:9999;
}
</style>