<template>
  <div class="submit-successfully-content">
    <div>
      <img class="submit-successfully-img" src="https://img2.baidu.com/it/u=3294972975,2428297085&fm=253&fmt=auto&app=138&f=JPEG?w=320&h=320" alt="">
    </div>
    <div class="submit-successfully-tilte">您的工单已提交成功，我们会尽快为您处理</div>
    <div class="submit-successfully-desc">您可在“工单列表”-“工单详情”中，查看工单的处理状态。</div>
    <div class="submit-successfully-btn">
      <el-button @click="goback">返回</el-button>
      <el-button type="primary">查看工单</el-button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SubmitSuccessfully',
  components: { },
  data() {
    return {
    };
  },
  watch: {
  },
  created() {

  },
  methods: {
    goback() {
    }
  }
};
</script>

<style scoped lang="scss">
.submit-successfully-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .submit-successfully-img{
      width: 104px;
      height: 104px;
      object-fit: cover;
    }
    .submit-successfully-tilte{
      margin-top:23px;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 28px;
    }
    .submit-successfully-desc{
      margin-top:4px;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins;
      font-size: 16px;
    }
    .submit-successfully-btn{
      margin-top:20px;
      font-size: 14px;
      /deep/ .el-button{
        font-family: Poppins;
        font-weight: 500;
        height: 40px;
        border-radius: 12px;
      }
    }
}

</style>
