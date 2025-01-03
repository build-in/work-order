<template>
  <div class="no-workorder-found">
    <div class="no-content">
      <div class="dialog-image">
        <img src="../../../../public/image/merchant/cryboy.png" alt="">
      </div>
      <div class="dialog-desc">
        {{ $t('workOrderInfo.noRelevantOrderLetterFound') }}
      </div>
      <div class="dialog-dedal">
        {{ $t('workOrderInfo.describeYourIssueBelow') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoWorkOrderFound',
  components: { },
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
.no-workorder-found{
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-bottom: 30px;
  .no-content{
    width:900px;
    display: contents;
    .dialog-image{
        img{
          width: 95.3px;
          height: 95.3px;
          object-fit: cover;
        }
    }
    .dialog-desc{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins-SemiBold;
        font-size: 28px;
        line-height: 42px;
        text-align: center;
    }
    .dialog-dedal{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins;
        font-size: 16px;
        line-height: 24px;
        margin-top: 4px;
    }
  }

}
</style>
