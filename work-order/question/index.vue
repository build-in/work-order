<template>
  <div class="nav-order-create">
    <div class="search-content-mess">
      <NoWorkOrderFound />
      <ProblemDescription />
    </div>
  </div>
</template>
<script>

import NoWorkOrderFound from '../components/noWorkOrderFound';
import ProblemDescription from '../components/problemDescription';

export default {
  name: 'WorkOrder',
  components: {
    ProblemDescription,
    NoWorkOrderFound
  },
  data() {
    return {};
  },
  methods: {
  }
};
</script>

  <style scoped lang="scss">
  .search-content-mess{
    margin-top:40px;
  }
  </style>
