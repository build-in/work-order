<template>
  <div v-if="item && item.retractFlag && item.direction === Te " class="revock-chat">
    {{ $t('workOrderInfo.recalledBySender') }}
  </div>
  <div v-else :class="['desc', item.direction === Co ? 'session-card-container': '']">
    <div class="session-card">
      <div class="common-card">
        <div :class="['desc', item.direction === Co ? 'blue': 'green']">
          <!-- 系统对话 -->
          <div v-if="item.type == 'system_contact'" class="content-set">
            {{ language == 'cn' ? parerFont(item.content).cn : parerFont(item.content).en }}
          </div>
          <!-- 个人发送 -->
          <div v-else class="content-set">
            <div v-if="item.content.includes('\n')">
              <div v-html="htmlList" />
            </div>
            <div v-else> {{ item.content }}</div>
          </div>
          <div v-if="item.fileInfo && parerFont(item.fileInfo).length > 0" class="data-list">
            <div v-for="(data,index) in parerFont(item.fileInfo)" :key="index" class="data-list-item">
              <downloadCard :file-info="data" />
            </div>
          </div>
        </div>
        <div v-if="item.createTime" :class="[item.direction === Co ? 'time':'timeRight']">{{ item.createTime | formateDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import downloadCard from './downloadCard';
import datetime from '@/libs/util.datetime';

import { Technology, Commercial } from '../../const/index';
export default {
  name: 'SessionCard',
  components: { downloadCard },
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      Te: Technology,
      Co: Commercial,
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
    ]),
    htmlList() {
      if (this.item && this.item.type == 'person_contact') {
        return this.item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n').map(item => `<div>${item}</div>`).join('');
      }
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    parerFont(text) {
      return JSON.parse(text);
    }
  }
};
</script>

<style scoped lang="scss">
.revock-chat{
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #999;
}
.session-card-container{
  display: flex;
  justify-content: end;
}
.session-card{
  padding: 0 30px;
  display: inline-block;
  .common-card{
    margin-top:20px;
    // width: calc(100vw - 468px);
    .desc{
      color: rgba(27, 29, 31, 1);
      font-size: 14px;
      line-height: 21px;
      font-family: Poppins;
      padding:  8px 24px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 1);
      .content-set{
        max-width: calc(100vw - 600px);
        word-wrap: break-word;
      }
      .data-list{
        margin-top: 8px;
        margin-left: -8px;
        display: flex;
        flex-wrap: wrap; /* 允许换行 */
        .data-list-item{
          flex: 0 0 auto; /* 不增长、不缩小、基于内容的大小 */
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          margin-left: 8px;
          cursor: pointer;
          // &:first-child{
          //   margin-left: 0px;
          // }
        }
      }
    }
    .blue{
      border-right: 4px solid rgba(55, 130, 255, 1);
    }
    .green{
      border-left: 4px solid rgba(0, 195, 82, 1);
    }
    .time{
      color: rgba(157, 162, 167, 1);
      font-family: Poppins;
      font-size: 12px;
      display: flex;
      justify-content: end;
      margin-right:5px;
      // margin-left:24px;
    }
    .timeRight{
      color: rgba(157, 162, 167, 1);
      font-family: Poppins;
      font-size: 12px;
      display: flex;
      justify-content: start;
      margin-left:5px;
    }
  }
}
</style>
