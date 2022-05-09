<template>
  <div>
    <div class="test-single">
      <div class="label">
        <span v-if="!!field.required" class="req">*</span>
        <span v-if="index">{{index}}.</span>{{field.label}}
        <span class="desc">{{questionType + (field.hasOwnProperty('score')?`（分值：${field.score}分）`:'')}}</span>
      </div>
      <div class="tips" v-if="field.tips">
        {{field.tips}}
      </div>
      <el-input
        v-model="field.answer"
        show-word-limit
        :maxlength="field.maxlength" 
        :minlength="field.minlength"
        size="small">
      </el-input>
    </div>
    <field-edit-panel v-if="edit" type="exam" :field="field" @end-edit="bindEndEdit">
      <template slot="label">答案</template>
      <template slot="options">
        <el-input
          size="small"
          clearable
          show-word-limit
          v-model="field.answer"
          :maxlength="100">
        </el-input>
      </template>
    </field-edit-panel>
  </div>
  
</template>
<script>
  import { fieldMixin } from './mixins'
  import FieldEditPanel from './field-edit-panel.vue'

  export default {
    mixins: [ fieldMixin ],
    components: { FieldEditPanel },
    data () {
      return {
      }
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .test-single {
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
