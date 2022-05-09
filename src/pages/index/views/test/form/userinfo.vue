<template>
  <div>
    <div class="test-userinfo">
      <div class="label">
        <span v-if="!!field.required" class="req">*</span>
        <span v-if="index">{{index}}.</span>
        {{field.label}}
      </div>
      <div class="tips" v-if="field.tips">
        {{field.tips}}
      </div>
      <el-input
        show-word-limit
        :maxlength="field.maxlength" 
        :minlength="field.minlength"
        size="small">
        <template slot="prepend">
          <svg-icon :icon-class="`form-${field.name}`" class="icon"></svg-icon>
        </template>
      </el-input>
    </div>
    <field-edit-panel v-if="edit" type="form" :field="field" @end-edit="bindEndEdit"></field-edit-panel>
  </div>
  
</template>
<script>
  import { fieldMixin } from './mixins'
  import FieldEditPanel from './field-edit-panel.vue'

  export default {
    mixins: [ fieldMixin ],
    components: { FieldEditPanel }
  }
</script>
<style lang="scss" scoped>
  .test-userinfo {
    padding: 10px 20px 10px 20px;
    cursor: pointer;
    .label {
      margin: 0 0 10px 0;
      position: relative;
      font-size: 14px;
      .req {
        color: red;
        position: absolute;
        left: -10px;
        top: 5px;
      }
    }
    .tips {
      font-size: 14px;
      line-height: 1.5;
      color: #909399;
    }
  }
</style>
