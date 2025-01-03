<template>
  <div :style="{ width: lineWidth? lineWidth + 'px': '100%' }" class="line-divider-content">
    <el-divider />
  </div>
</template>
<script>

export default {
  name: 'DividerLine',
  props: {
    lineWidth: String,
    default: ''
  },
  data() {
    return {
    };
  }
};
</script>

<style scoped lang="scss">
.line-divider-content{
   width:900px;
   /deep/ .el-divider {
    background-color: rgba(234, 234, 234, 1);
  }
  /deep/ .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 0;
 }
}
</style>

