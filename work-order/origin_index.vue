<template>
  <div class="work-order">
    <full-screen-layout :show-has-back-btn="false" content-width="100%">
      <template slot="nav">
        <!-- 工单信息TAB -->
        <ul v-if="currentUrlName !== 'dialogue'" class="nav-top-list">
          <li
            v-for="(item, index) in routerConfigList"
            :class="{ 'nav-top-list__item__active': index == currentIndex }"
            :key="index"
            class="nav-top-list__item">
            <span type="text" class="nav-top-list__item__btn" @click="switchRouterItem(item, index)">{{ language === 'cn' ? item.name : item.nameEn }}</span>
          </li>
        </ul>
        <!-- 面包屑 -->
        <div v-else>
          <Breadcrum />
        </div>
        <!-- 顶部右边功能大全 -->
        <div class="nav-top-list-right">
          <!-- 工单通知 -->
          <div class="icon_notice-wrap" @click="onOpenNotice">
            <div v-show="noticeTotal != 0">
              <el-tooltip :content="$t('common.notification')" placement="top-end">
                <el-badge :value="noticeTotal" :max="99">
                  <d2-icon-svg name="icon_notice" class="icon_notice" />
                </el-badge>
              </el-tooltip>
            </div>
            <div v-show="noticeTotal == 0">
              <el-tooltip :content="$t('common.notification')" placement="top-end">
                <d2-icon-svg name="icon_notice" class="icon_notice" />
              </el-tooltip>
            </div>
          </div>
          <!-- 用户信息 -->
          <div class="work-order-user">
            <UserChooser />
          </div>
        </div>
      </template>
      <!-- 工单路由局部切换 -->
      <template slot="content">
        <Search v-if="showSearch" @searchContent="searchContent" />
        <router-view v-if="showRouterView" />
      </template>
    </full-screen-layout>
    <!-- 工单通知组件 -->
    <notice-drawer ref="noticeDrawers" @updateReadCount="queryNoticeCountTotal" />
  </div>
</template>
<script>
import FullScreenLayout from '@/layout/fullWorkOrderLayout/index.js';
import Search from './components/search';
import WorkOrderList from './orderList/list/index';
import QuestionCard from './components/questionCard.vue';
import UserChooser from '@/layout/mainLayout/components/header/components/user';
import NoticeDrawer from '@/layout/mainLayout/components/work-notice';
import Breadcrum from './common/breadcrum';
import { getUnreadMessageList } from '@/api/workOrder';
import local from './local';
import { mapState } from 'vuex';

const SCOPE_NAME = 'workOrderInfo';

export default {
  name: 'WorkOrder',
  components: {
    FullScreenLayout,
    Search,
    WorkOrderList,
    QuestionCard,
    UserChooser,
    NoticeDrawer,
    Breadcrum
  },
  data() {
    return {
      currentIndex: 1,
      routerConfigList: [
        {
          name: '发起咨询',
          nameEn: 'Create Ticket',
          routerName: 'crateWorkOrder'
        },
        {
          name: '我的咨询',
          nameEn: 'My Ticket',
          routerName: 'workOrderList',
        }
      ],
      noticeTotal: 0,
      noticeList: [],
      searchContentStatus: 1,
      // 定位到创建工单的路由
      routerList: [
        'question', // 未关联交易单
        'content', // 没有工单新建-其他
        'va', // VA账号
        'inquirySheet', // 咨询单
        'existing', // 已有工单
        'systemCollects', // 系统收集工单
        'dialogue', // 工单对话
      ],
      currentUrlName: '',
      showSearch: false,
      showRouterView: true,
      timerId: null, // 用于存储定时器的 ID
      timerIdTwo: null,
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  watch: {
    $route(to, from) {
      this.currentIndex = this.routerConfigList.findIndex(item => item.routerName == to.name);
      this.chooseCurrentUrl();
    }
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[SCOPE_NAME]) {
      this.$i18n.mergeLocaleMessage('en', local.en);
      this.$i18n.mergeLocaleMessage('cn', local.cn);
    }
    this.queryNoticeCountTotal();
  },
  mounted() {
    this.currentIndex = this.routerConfigList.findIndex(item => item.routerName == this.$route.name);
    this.chooseCurrentUrl();
    this.startTimer();
    this.timerIdTwo = setTimeout(() => {
      clearInterval(this.timerId); // 清除定时器
      clearTimeout(this.timerIdTwo);
      this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
      this.timerIdTwo = null;
    }, 7200000);
  },
  beforeDestroy() {
    clearInterval(this.timerId); // 清除定时器
    this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
  },
  methods: {
    startTimer() {
      try {
        this.timerId = setInterval(() => {
          this.queryNoticeCountTotal();
        }, 60000); // 60秒 = 60000毫秒
      } catch (e) {
        this.clearTimer();
      }
    },
    // 页面初始化 + 页面路由切换 都要重新回去路由
    chooseCurrentUrl() {
      this.chooseFirstTab();
      this.currentUrlName = this.getUrlname();
      this.justShowSearch();
    },
    getUrlname() {
      return this.$route.path.split('/')[2];
    },
    // 判断是否展示搜索框
    justShowSearch() {
      if (this.$route.path.split('/')[2] === 'list' || this.$route.path.split('/')[2] === 'dialogue') {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
    },
    switchRouterItem(item, index) {
      this.currentIndex = index;
      this.$router.push({ name: item.routerName });
    },
    onOpenNotice() {
      this.$refs.noticeDrawers.open(this.noticeList);
    },
    clearTimer() {
      clearInterval(this.timerId); // 清除定时器
      clearTimeout(this.timerIdTwo);
      this.timerId = null; // 将 timerId 设置为 null，以确保不再引用该定时器
      this.timerIdTwo = null;
    },
    queryNoticeCountTotal() {
      getUnreadMessageList({ pageSize: 15, pageNum: 1 })
        .then(response => {
          if (response.data) {
            const { data } = response.data;
            const { rows, total } = data;
            this.noticeList = rows;
            this.noticeTotal = total;
          }
        }).catch(error => {
          this.clearTimer();
        });
    },
    chooseFirstTab() {
      if (this.routerList.includes(this.getUrlname())) {
        this.currentIndex = 0;
      }
    },
    searchContent(status) {
      if (status.type === 'hide') {
        this.showRouterView = false;
      } else {
        this.showRouterView = true;
      }
    },
  }
};
</script>

<style scoped lang="scss">
.work-order {
  .nav-top-list {
    list-style: none;
    padding: 0;
    margin: 0 0 0 16px;
    display: flex;
    align-items: center;
    min-width: 300px;
    height: 100%;

    .el-button--text {
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: #9DA2A7;

      &:hover {
        background-color: transparent;
      }

      &:focus {
        background-color: transparent;
      }
    }

    &__item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 100%;

      .nav-top-list__item__btn {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        cursor: pointer;
        color: #9DA2A7;
      }

      &__active {
        .nav-top-list__item__btn {
          color: #1B1D1F;

          &:after {
            position: absolute;
            background: #1B1D1F;
            height: 3px;
            inset: auto 12px 0px;
            content: "";
          }
        }
      }
    }
  }

  .nav-top-list-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    margin-right: 30px;

    .icon_notice-wrap {
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 0 16px;

      .el-badge {
        display: flex;
      }

      &:hover {
        background-color: #F8F8F8;
        border-radius: 12px;
      }
    }

    .work-order-user {
      /deep/.user-first-wrap {
        position: relative;
        display: flex;
        .time-zone {
          left: -12px;
          top: 24px;
        }
      }

    }
  }

  /deep/.icon_notice {
    cursor: pointer;
    width: 20px !important;
    height: 20px !important;
  }

  // /deep/ .logo-container__component .drawer-component__main {
  //   overflow-x: hidden;
  // }
}
</style>
