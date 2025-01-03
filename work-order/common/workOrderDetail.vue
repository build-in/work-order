<template>
  <div class="order-detail-content">
    <ul>
      <li>
        <div>{{ $t('workOrderInfo.workOrderNumber') }}</div>
        <div>{{ workOrderInfo.formNo }}</div>
      </li>
      <!-- <li>
        <div>{{ $t('workOrderInfo.workOrderType') }}</div>
        <div>{{ setWorkType(workOrderInfo.type, language) }}</div>
      </li>
      <li>
        <div>{{ $t('workOrderInfo.problemType') }}</div>
        <div>{{ setProlblem(workOrderInfo.problemType, language) }}</div>
      </li> -->
      <!-- <li>
        <div>{{ $t('workOrderInfo.problemDescription') }}</div>
        <el-tooltip  v-if="workOrderInfo.description" class='item' effect='dark' :content='workOrderInfo.description' placement='top-start'>
          <div class="hideline">{{ (workOrderInfo.description.length > 15 ? workOrderInfo.description.substring(0, 15)+ '...': workOrderInfo.description) || '-' }}</div>
        </el-tooltip>
        <div v-else>-</div>
      </li> -->
      <li>
        <div>{{ $t('workOrderInfo.creationTime') }}</div>
        <div v-if="workOrderInfo.createTime">{{ workOrderInfo.createTime | formateDate }}</div>
        <div v-else>-</div>
      </li>
      <li>
        <div>{{ $t('workOrderInfo.completionTime') }}</div>
        <div v-if="workOrderInfo.finishTime">{{ workOrderInfo.finishTime | formateDate }}</div>
        <div v-else>-</div>
      </li>
      <li>
        <div>{{ $t('workOrderInfo.creator') }}</div>
        <div class="email">
          <el-avatar size="small">{{ getAcronym(workOrderInfo.creator) }}</el-avatar>
          <div>{{ workOrderInfo.creator }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import datetime from '@/libs/util.datetime';
import { TYPE, STATUS, PROBLEM_TYPE } from '../const/index';
import { mapState } from 'vuex';
export default {
  name: 'workOrderDetail',
  components: { },
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    workOrderInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
    ]),
  },
  watch: {
  },
  created() {
  },
  methods: {
    getAcronym(word) {
      if (!word) return '';
      return word[0].toUpperCase();
    },
    setWorkType(text, language) {
      const current = TYPE.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
    setStatus(text, language) {
      const current = STATUS.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
    setProlblem(text, language) {
      const current = PROBLEM_TYPE.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
  }
};
</script>

<style scoped lang="scss">
.order-detail-content{
  ul{
    margin-left:-40px;
    // margin-bottom: 28px;
    font-family: Poppins;
    li{
      list-style: none;
      margin-bottom: 16px;
      position: relative;
      &:last-child{
        margin-bottom: 0;
      }
      div {
        &:nth-child(1){
          color: rgba(157, 162, 167, 1);
          font-family: Poppins-SemiBold;
          font-size: 12px;
        }
        &:nth-child(2){
          color: rgba(27, 29, 31, 1);
          font-family: Poppins;
          font-size: 14px;
        }
      }
      .email{
        display: flex;
        align-items: center;
        :nth-child(2){
          margin-left:8px;
        }
      }
    }
  }
  .hideline{
    overflow: hidden;
    text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
}
</style>
