<template>
  <div v-if="paper" class="paper-answer">
    <div v-if="field.correct" class="succ">
      <i class="el-icon-success"> 正确</i>
      <span class="right-score">+{{field.score}}分</span>
    </div>
    <div v-else class="error">
      <i class="el-icon-error"> 错误</i>
      <span class="right-score">+0分</span>
      <div class="answer">
        <div class="label">正确答案：</div>
        <div>{{field.answer|formatAnswer}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { fieldMixin } from './mixins'
  import test from '@/utils/test'

  export default {
    mixins: [ fieldMixin ],
    filters: {
      formatAnswer(answer) {
        if(!answer) return ''
        return test.array(answer) ? answer.join(' | ') : answer
      }
    }
  }
</script>
<style lang="scss" scoped>
  .paper-answer {
    margin-top: 15px;
    padding: 0 15px;
    border-radius: 5px;
    border: 1px solid #EBEEF5;
    background-color: #FAFAFA;
    .right-score {
      float: right;
    }
    .succ {
      color: #67C23A;
    }
    .error {
      color: #F56C6C;
    }
    .answer {
      line-height: 1.5;
      padding-bottom: 10px;
      color: #606266;
      .label {
        color: #67C23A;
      }
    }
  }
</style>
