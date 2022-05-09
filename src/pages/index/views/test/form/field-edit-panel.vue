<template>
  <el-card class="edit-panel">
    <slot v-if="$slots.custom" name="custom"></slot>
    <el-descriptions v-else :column="3" size="mini" border>
      <el-descriptions-item label="题目" :span="3">
        <el-input 
          size="mini"
          type="textarea"
          v-model="field.label"
          show-word-limit
          :rows="2" 
          :maxlength="300">
        </el-input>
      </el-descriptions-item>
      <el-descriptions-item label="必答">
        <el-switch size="mini" v-model="field.required"></el-switch>
      </el-descriptions-item>
      <el-descriptions-item v-if="field.hasOwnProperty('score')" label="题目分数">
        <el-input-number v-model="field.score" size="mini" :step="0.5" style="width:110px" :min="0" :max="100"></el-input-number>
      </el-descriptions-item>
      <el-descriptions-item v-if="field.hasOwnProperty('rule')" label="填写验证">
        <el-select size="mini" v-model="field.rule" clearable placeholder="请选择">
          <el-option
            v-for="item in ruleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item v-if="field.hasOwnProperty('maxlength')" label="限制字数">
        <el-input-number v-model="field.minlength" size="mini" :step="1" style="width:90px" controls-position="right" :min="0" :max="300"></el-input-number>
        -
        <el-input-number v-model="field.maxlength" size="mini" :step="5" style="width:90px" controls-position="right" :min="0" :max="300"></el-input-number>
      </el-descriptions-item>
      <el-descriptions-item 
        v-if="fixCell" 
        :span="3-fixCell"
        :labelStyle="{borderRight:'0',backgroundColor:'#FFF'}"
        :contentStyle="{borderLeft:'0'}">
      </el-descriptions-item>
      <el-descriptions-item v-if="$slots.options" :span="3">
        <template slot="label">
          <slot v-if="$slots.label" name="label"></slot>
          <span v-else>选项</span>
        </template>
        <slot name="options"></slot>
      </el-descriptions-item>
    </el-descriptions>
    <div class="button-area">
      <el-alert
        v-if="!doneEdit"
        title="未设置正确答案"
        type="error"
        :closable="false"
        show-icon>
      </el-alert>
      <el-button v-else type="success" size="small" icon="el-icon-check" @click.stop="bindEndEdit">完成编辑</el-button>
      <div class="filltips">
        <el-button size="mini" v-if="type!='group'" :type="field.tips?'primary':'default'" plain @click.stop="showTipsDialog" round icon="el-icon-info">填写提示</el-button>
      </div>
    </div>
  </el-card>
</template>
<script>
  import { fieldMixin } from './mixins'

  export default {
    mixins: [ fieldMixin ],
    props: {
      field: {
        type: Object,
        default: () => {}
      },
      type: {
        validator: function(value) {
          return ['form','exam','group'].includes(value)
        }
      }
    },
    computed: {
      fixCell() {
        let cells = (
          1 +
          this.field.hasOwnProperty('score') + 
          this.field.hasOwnProperty('maxlength') + 
          this.field.hasOwnProperty('rule')
        ) % 3
        return cells
      },
      doneEdit() {
        if(!this.field.hasOwnProperty('answer')) return true
        
        if(Object.prototype.toString.apply(this.field.answer) === '[object Array]') {
          return this.field.answer.length && this.field.answer.every(val => this.field.options.includes(val))
        } else {
          return this.field.answer
        }
      }
    },
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
      showTipsDialog() {
        this.$prompt('请填写提示，字数为300个以内', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputPlaceholder: '请输入填写提示',
          inputType: 'textarea',
          inputValue: this.field.tips,
          inputPattern: /^.{0,300}$/,
          inputErrorMessage: '填写提示只能为300个字符以内！',
        }).then(({ value }) => {
          this.field.tips = value
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="scss" scoped>
  .edit-panel {
    margin: 5px 20px;
    .button-area {
      margin-top: 15px; text-align: center;
      .el-alert {
        display: inline; margin-right: 10px
      }
      .filltips {
        float: right;
      }
    }
  }
</style>
