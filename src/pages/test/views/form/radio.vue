<template>
  <div>
    <div v-if="!paper&&field.tips" class="tips">{{field.tips}}</div>
    <el-radio-group 
      size="small" 
      v-model="field.value">
      <el-radio 
        v-for="(option, index) in field.options" 
        :key="index"
        :label="option">
        {{String.fromCharCode(65+index)}}、{{option}}
      </el-radio>
    </el-radio-group>
    <test-answer
      :field="field"
      :paper="paper">
    </test-answer>
  </div>
</template>
<script>
  import { fieldMixin } from './mixins'
  import TestAnswer from './answer.vue'

  export default {
    mixins: [ fieldMixin ],
    components: { TestAnswer }
  }
</script>
<style lang="scss" scoped>
  .el-radio-group {
    display: block;
  }
   /deep/ .el-radio{
    display: flex;
    align-items : center;
    white-space: normal;
    border-bottom: 1px solid #E4E7ED;
    padding: 15px 10px;
    margin: 0;
    line-height: 19px;
  }
</style>
