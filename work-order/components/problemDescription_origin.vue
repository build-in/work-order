<template>
  <div class="problem-description-content">
    <main class="problem-description">
      <section>
        <header v-if="title">{{ title }}</header>
        <div v-if="title" class="divider-line">
          <DividerLine />
        </div>
        <QuestionFile :title="$t(`workOrderInfo.describeYourIssue`)" />
      </section>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DividerLine from '../common/dividerLine';
import QuestionFile from './questionFile';
export default {
  name: 'ProblemDescription',
  components: { DividerLine, QuestionFile },
  props: {
    title: String,
    default: ''
  },
  data() {
    return {
      labelPosition: 'top',
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language'
    ])
  },
  watch: {
  },
  created() {
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.problem-description-content {
  .problem-description {
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    header {
      width: 900px;
      color: rgba(27, 29, 31, 1);
      font-family: Poppins-SemiBold;
      font-size: 20px;
    }

    .divider-line {
      margin-top: 24px;
      margin-bottom: 32px;
    }
  }
}
</style>
