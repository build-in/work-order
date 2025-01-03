<template>
  <div class="status-card-content">
    <div>
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusCard',
  props: {
    text: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    }
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
</style>
