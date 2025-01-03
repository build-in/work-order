<template>
  <span class="table-amount">
    <span class="amount">{{ $util.string.amountFormat(amount, currency) }}</span>
    <span class="currency">{{ currency }}</span>
  </span>
</template>
<script>
export default {
  props: {
    amount: {
      type: String | Number,
      default: ''
    },
    currency: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
.table-amount {
  width: 100%;
  .currency {
    font-size: 12px;
    color: $color-neutral-light-400;
    font-weight: 400;
    margin-left: 2px;
    line-height: 18px;
  }
}

</style>
