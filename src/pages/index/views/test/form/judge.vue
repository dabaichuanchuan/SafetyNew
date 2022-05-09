<template>
  <div>
    <div class="test-radio">
      <div class="label">
        <span v-if="!!field.required" class="req">*</span>
        <span v-if="index">{{index}}.</span>{{field.label}}
        <span class="desc">{{questionType + (field.hasOwnProperty('score')?`（分值：${field.score}分）`:'')}}</span>
      </div>
      <div class="tips" v-if="field.tips">
        {{field.tips}}
      </div>
      <el-radio-group 
        size="small" 
        v-model="field.answer">
        <el-radio 
          v-for="(option, index) in field.options" 
          :key="index"
          :label="`${option}`">
          {{String.fromCharCode(65+index)}}、{{option}}
        </el-radio>
      </el-radio-group>
    </div>
    <field-edit-panel v-if="edit" type="exam" :field="field" @end-edit="bindEndEdit">
      <template slot="options">
        <div class="radio-options">
          <el-radio-group 
            size="small" 
            v-model="field.answer">
            <el-row class="row" :gutter="12" v-for="(item, index) in field.options" :key="index">
              <el-col :span="14">
                <el-input 
                  size="mini" 
                  :value="field.options[index]" 
                  @input="val=>bindOptionInput(val, index)" 
                  show-word-limit 
                  :maxlength="150">
                </el-input>
              </el-col>
              <el-col :span="3">
                <el-radio size="mini" :label="item">答案</el-radio>
              </el-col>
              <el-col :span="7">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-arrow-up" @click.stop="bindRadioClick(index, 'up')"></el-button>
                  <el-button size="mini" icon="el-icon-arrow-down" @click.stop="bindRadioClick(index, 'down')"></el-button>
                </el-button-group>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
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
    methods: {
      bindRadioClick(index, name) {
        const options = this.field.options
        switch (name) {
          case 'up': 
            if(!index) return
            options[index] = options.splice(index - 1, 1, options[index])[0]; break
          case 'down':
            if(index == options.length - 1) return
            options[index] = options.splice(index + 1, 1, options[index])[0]; break
        }
      },
      bindOptionInput(value, index) {
        const option = this.field.options[index]
        if(this.field.answer == option) {
          this.field.answer = value
        }
        this.$set(this.field.options, index, value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-radio {
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
  }
  .radio-options {
    .row {
      margin-bottom: 5px;
    }
    .el-radio-group {
      display: block;
    }
    /deep/ .el-radio{
      line-height: 28px;
    }
  }
</style>
