<template>
  <div>
    <div v-if="paper" class="paper-userinfo">{{field.value}}</div>
    <template v-else>
      <div v-if="field.tips" class="tips">{{field.tips}}</div>
      <el-input
        size="small"
        v-model="field.value" 
        :maxlength="field.maxlength||100" 
        :minlength="field.minlength||0">
        <template slot="prepend">
          <svg-icon :icon-class="`form-${field.name}`" class="icon"></svg-icon>
        </template>
      </el-input>
    </template>
  </div>
</template>
<script>
  import { fieldMixin } from './mixins'

  export default {
    mixins: [ fieldMixin ]
  }
</script>
<style lang="scss" scoped>
  .paper-userinfo {
    padding: 0 15px;
    border-radius: 5px;
    border: 1px solid #EBEEF5;
    background-color: #FAFAFA;
  }
</style>