<template>
  <div class="card-info">
    <div class="title">{{ title }}</div>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
};
</script>

<style scoped lang="scss">
.card-info {
  margin-top: 40px;
  .title {
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 12px;
    border-bottom: 1px solid $color-neutral-light-100;
    margin-bottom: 16px;
  }
}
</style>
