
<template>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in timeLines"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size">
      <template>
        <div class="label"> {{ $util.string.betterDisplay(renderField(activity, 'label')) }}</div>
        <div class="description">{{ renderField(activity, 'description') }}</div>
        <div class="time">{{ renderTime(activity) }}</div>
      </template>
    </el-timeline-item>
  </el-timeline>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    timeLines: {
      type: Array,
      required: true,
      default: () => []
    },
    // 数据来源 back<后端响应> ｜ front <前端配置在local.js,无需区分中英文字段>
    dataSource: {
      type: String,
      default: 'back'
    },
    // label 中英文field
    label: {
      type: Object,
      default: () => ({ cn: 'event', en: 'eventEn' })
    },
    // 描述 中英文field
    description: {
      type: Object,
      default: () => ({ cn: 'desc', en: 'descEn' })
    },
    // 时间 中英文field
    time: {
      type: String,
      default: 'time'
    }
  },
  computed: {
    ...mapGetters('d2admin/profile', [
      'language',
    ]),
  },
  methods: {
    // 检测time字段是否为时间戳
    isTimestamp(value) {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    },
    renderField(row, key) {
      if (this.dataSource === 'back') {
        // 根据多语言及props中传入的字段进行映射
        const filed = this[key][this.language || 'cn'];
        return row[filed] || '';
      } else {
      //   TODO 前端映射直接展示
      }
    },
    renderTime(row) {
      if (!this.time || !row.hasOwnProperty(this.time)) return '';

      // 时间戳 数据转换
      if (this.isTimestamp(row[this.time])) {
        return this.$util.datetime.formatUtcToZoneTime(row[this.time]);
      } else {
        return row[this.time];
      }
    },
  },
};
</script>

<style scoped lang="scss">
$color-400: $color-neutral-light-400;
.label {
  color: $color-neutral-light-500;
  line-height: 21px;
}
.description {
  color: $color-400;
  line-height: 21px;
  margin: 4px 0;
}
.time {
  color: $color-400;
  font-size: 12px;
  line-height: 18px;
  padding-bottom: 16px;

}
/deep/ .el-timeline-item {
  padding-bottom: 0;
}

/deep/ .el-timeline-item__timestamp.is-bottom {
  margin-top: 0;
}
</style>
