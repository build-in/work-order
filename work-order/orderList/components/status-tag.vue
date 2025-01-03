
<template>
  <span v-show="!!statusMap.value">
    <el-tooltip :manual="isShowTip" :visible-arrow="false" :content="failureReason" effect="dark" placement="bottom">
      <mmc-tag :status="statusMap.type"> {{ statusMap.label }}</mmc-tag>
    </el-tooltip>
  </span>
</template>
<script>
export default {
  props: {
    statusOptions: {
      type: Array,
      required: true,
      default: () => ([]),
    },
    statusValue: {
      type: [String, Number],
    },
    failureReason: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    statusMap() {
      return (this.statusOptions || []).find(item => item.value == this.statusValue) || {};
    },
    isShowTip() {
      // 根据状态-失败 & 失败原因展示tooltip
      return !(this.statusMap.value == 'FAILED' && this.failureReason);
    }
  },
};
</script>

<style scoped lang="scss">

</style>
