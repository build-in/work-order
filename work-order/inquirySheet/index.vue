<template>
  <div class="problem-description-content">
    <main class="problem-description">
      <section>
        <QuestionFile :title="language==='cn'? cnTitle : enTitle " />
      </section>
    </main>
  </div>
</template>
<script>

import QuestionFile from '../components/questionFile.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'InquirySheet',
  components: {
    QuestionFile
  },
  data() {
    return {
      cnTitle: this.$route.query.zhName || '',
      enTitle: this.$route.query.enName || '',
    };
  },
  computed: {
    ...mapGetters('d2admin/profile', [
      'language'
    ])
  },
  methods: {
  }
};
</script>

  <style scoped lang="scss">
.problem-description-content{
  margin-top:40px;
  .problem-description{
    section{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    header{
      width: 900px;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
    }
    .divider-line{
      margin-top:24px;
      margin-bottom: 32px;
    }
  }
}
  </style>
