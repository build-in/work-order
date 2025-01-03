<template>
  <!-- <div class="breadcrum-content" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/list' }">工单列表</el-breadcrumb-item>
    <el-breadcrumb-item>工单详情</el-breadcrumb-item>
  </div> -->
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a @click="goList">{{ $t('workOrderInfo.myTicket') }}</a></li>
      <li class="breadcrumb-item active" aria-current="page">{{ $t('workOrderInfo.workOrderDetails') }}</li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrum',
  components: { },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    goList() {
      this.$router.push({ path: '/work-order/list' });
    }
  }
};
</script>

<style scoped lang="scss">
/* 面包屑导航容器 */
.breadcrumb {
    list-style: none;
    padding: 0;
    // background-color: #f8f9fa;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  /* 面包屑导航的每一项 */
  .breadcrumb li {
    float: left;
    font-weight: 600;
    font-size: 18px;
    font-family: Poppins-SemiBold;
  }

  /* 面包屑导航的链接 */
  .breadcrumb li a {
    text-decoration: none;
    padding: 0.75rem 1rem;
    position: relative;
    display: block;
    color: rgba(12, 113, 255, 1);
    cursor: pointer;
  }

  /* 面包屑导航链接的分隔符 */
  .breadcrumb li a:after {
    content: ">";
    color: #6c757d;
    margin-left: 12px;
    position: absolute;
    right: -5px;
    top: 50%;
    font-size: 12px;
    transform: translateY(-50%);
  }

  /* 面包屑导航的最后一个链接（移除分隔符） */
  .breadcrumb li:last-child a:after {
    content: "";
    margin: 0;
  }

  /* 面包屑导航的当前项（通常不是链接） */
  .breadcrumb li.active {
    color: rgba(27, 29, 31, 1);
    margin-left: 14px;
  }

  /* 面包屑导航的当前项样式 */
  .breadcrumb li.active a {
    color: #6c757d;
    cursor: default;
    pointer-events: none;
  }

  /* 面包屑导航的当前项的分隔符样式 */
  .breadcrumb li.active a:after {
    color: #6c757d;
  }
</style>
