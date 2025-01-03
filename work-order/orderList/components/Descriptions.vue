<template>
  <div
    :class="{
      'description': true,
      'description-vertical': direction === 'vertical',
      'description-horizontal': direction === 'horizontal',
  }">
    <div
      :class="{
        'label': true,
        'font-weight-500': fontWeight === 500
    }">{{ label }}</div>
    <div class="value">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'vertical',
    },
    fontWeight: {
      type: Number,
      default: 600,
    }
  },
  data() {
    return {};
  },
  computed: {
  },
};
</script>

<style scoped lang="scss">
.description {
  word-wrap: break-word;
  width: 100%;
  margin-top:16px;

  .label {
    color: $color-neutral-light-300;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
  }

  .value {
    color: $color-neutral-light-500;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
  }

  .font-weight-500 {
    font-weight:500;
  }

}
// 垂直排列
.description-vertical {
  display:flex;
  flex-direction: column;
  .label {
    margin-bottom: 4px;
    align-items: center;
  }
}

// 水平排列 TODO
.description-horizontal {
  display: flex;
  align-items: center;
  margin-top:8px;
  .label {
    width:160px;
    margin-right: 16px;
  }
  .value {
    flex: 1;
  }
}

</style>
