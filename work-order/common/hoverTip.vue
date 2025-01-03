<template>
  <div class="hover-tip-content">
    <el-tooltip class='item' :content="text" placement='bottom-start' style='font-size: 14px;color: #1a1c21;'>
          {{text}}
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'HoverTip',
  props:{
    text:{
      type:String,
      default:''
    }
  },
  components: { },
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
</style>
