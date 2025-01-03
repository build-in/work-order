<template>
  <div class="work-been-added-content">
    <header>
      <div class="work-been-title">
        <div>平台系统检测到该笔存在异常，正在加急处理中</div>
        <div>技术支持核实中</div>
      </div>
      <div class="work-been-desc">
        <div>订单详情</div>
        <div>查看工单</div>
      </div>
    </header>
    <el-divider />
    <section>
      <ul>
        <li>
          <span><d2-icon-svg name="icon_notice" class="icon_notice" /></span>
          <span>来源</span>
          <span>系统采集</span>
        </li>
        <li>
          <span><d2-icon-svg name="icon_notice" class="icon_notice" /></span>
          <span>采集时间</span>
          <span>yyyy-mm-dd hh:mm:ss </span>
        </li>
        <li>
          <span><d2-icon-svg name="icon_notice" class="icon_notice" /></span>
          <span>业务类型</span>
          <span>收单</span>
        </li>
      </ul>
    </section>
    <OrderException />
  </div>
</template>
<script>

import OrderException from '../components/orderException';
export default {
  name: 'AworkOrderBeenAdded',
  components: { OrderException },
  data() {
    return {
    };
  },
  watch: {
  },
  created() {

  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.work-been-added-content{
  width:900px;
  header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ .el-divider--horizontal{
    margin: 24px 0 35px 0;
  }
  .work-been-title{
    display: flex;
    align-items: center;
    :nth-child(1){
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
    }
    :nth-child(2){
      font-family: Poppins;
      font-weight: 500;
      font-size: 14px;
      height: 28px;
      border-radius: 14px;
      background: rgba(234, 246, 252, 1);
      border-radius: 14px;
      width: 128px;
      text-align: center;
      line-height: 28px;
      color: rgba(89, 180, 209, 1);
      margin-left: 8px;
    }
  }
  .work-been-desc{
    display: flex;
    font-family: Poppins;
    font-weight: 500;
    font-size: 14px;
    color: rgba(12, 113, 255, 1);
    cursor: pointer;
    :nth-child(1){
      margin-right: 16px;
    }
  }
  ul{
    margin-left:-40px;
    margin-bottom: 28px;
    font-family: Poppins;
    li{
      list-style: none;
      margin-bottom: 12px;
      position: relative;
      &:last-child{
        margin-bottom: 0;
      }
      span {
        &:nth-child(2){
          margin-left: 3.5px;
          color: rgba(114, 120, 128, 1);
          font-size: 14px;
        }
        &:nth-child(3){
          position: absolute;
          left:0;
          margin-left:136px;
          color: rgba(0, 0, 0, 1);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
