<template>
  <div>
    <div v-if="!paper&&field.tips" class="tips">{{field.tips}}</div>
    <el-input
      size="small"
      v-model="field.value" 
      :maxlength="field.maxlength||100" 
      :minlength="field.minlength||0">
      <template v-if="field.name" slot="prepend">
        <svg-icon :icon-class="`form-${field.name}`" class="icon"></svg-icon>
      </template>
    </el-input>
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
</style>