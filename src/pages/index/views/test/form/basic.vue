<template>
  <div>
    <div class="test-basic">
      <div class="row" v-for="(prop, idx) in field.props" :key="idx">
        <div class="label">
          <span v-if="!!prop.required" class="req">*</span>
          <span v-if="index">{{index}}.</span>
          {{prop.label}}
        </div>
        <div class="tips" v-if="prop.tips">
          {{prop.tips}}
        </div>
        <el-input
          show-word-limit
          :maxlength="prop.maxlength"
          size="small">
          <template v-if="prop.name" slot="prepend">
            <svg-icon :icon-class="`form-${prop.name}`" class="icon"></svg-icon>
          </template>
        </el-input>
      </div>
    </div>
    <field-edit-panel v-if="edit" type="group" :field="field" @end-edit="bindEndEdit">
      <template slot="custom">
        <el-descriptions :column="3" size="mini" border>
          <template class="row" v-for="(prop, idx) in field.props">
            <el-descriptions-item :key="'lbl'+idx" label="标题" :span="3">
              <el-input 
                size="mini"
                v-model="prop.label"
                show-word-limit
                :maxlength="100">
                <el-button slot="append" :style="`color:${prop.tips?'#409EFF':''}`" size="mini" icon="el-icon-info" @click.stop="showTipsDialog(prop)"></el-button>
              </el-input>
            </el-descriptions-item>
            <el-descriptions-item :key="'req'+idx" label="必答">
              <el-switch size="mini" v-model="prop.required"></el-switch>
            </el-descriptions-item>
            <el-descriptions-item :key="'rule'+idx" label="填写验证">
              <el-select size="mini" v-model="prop.rule" clearable placeholder="请选择">
                <el-option
                  v-for="item in ruleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item :key="'limit'+idx" label="限制字数">
              <el-input-number v-model="prop.minlength" size="mini" :step="1" style="width:90px" controls-position="right" :min="0" :max="300"></el-input-number>
              -
              <el-input-number v-model="prop.maxlength" size="mini" :step="5" style="width:90px" controls-position="right" :min="0" :max="300"></el-input-number>
            </el-descriptions-item>
          </template>
        </el-descriptions>
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
    data() {
      return {
        ruleOptions: [
          { label: '中文姓名', value: 'fullname' },
          { label: '汉字数字', value: 'cnOrNum' },
          { label: '汉字', value: 'chinese' },
          { label: '字母数字', value: 'enOrNum' },
          { label: '字母', value: 'letter' },
          { label: '手机号', value: 'mobile' },
          { label: '固定电话', value: 'landline' },
          { label: '身份证', value: 'idCard' },
          { label: '日期', value: 'dateISO' },
          { label: '时间', value: 'simpleTime' },
          { label: '整数', value: 'digits' },
          { label: '小数', value: 'amount' },
          { label: '邮件', value: 'email' },
        ]
      }
    },
    methods: {
      showTipsDialog(prop) {
        this.$prompt('请填写提示，字数为300个以内', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputPlaceholder: '请输入填写提示',
          inputType: 'textarea',
          inputValue: prop.tips,
          inputPattern: /^.{0,300}$/,
          inputErrorMessage: '填写提示只能为300个字符以内！',
        }).then(({ value }) => {
          prop.tips = value
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-basic {
    cursor: pointer;
    .row {
      padding: 10px 20px 10px 20px;
    }
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