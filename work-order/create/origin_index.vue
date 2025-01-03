<template>
  <div class="work-order-create">
    <div class="nav-order-create">
      <QuestionCard />
    </div>
  </div>
</template>
<script>
import QuestionCard from '../components/questionCard.vue';

export default {
  name: 'WorkOrder',
  components: {
    QuestionCard,
  },
  data() {
    return {
      currentIndex: 1,
      noticeTotal: 0,
    };
  },
  methods: {
    switchRouterItem(item, index) {
      this.currentIndex = index;
      this.$router.push({ name: item.routerName });
    }
  }
};
</script>

  <style scoped lang="scss">
  .work-order{
    .nav-order-create,.nav-order-list{
      // margin-top: -24px;
    }
  }
  </style>
