<template>
  <div>
    <div class="test-header" @click.stop="dialogVisible=true">
      <div class="title">{{value.title}}</div>
      <div class="describe" v-if="!!value.describe">{{value.describe}}</div>
    </div>
    <el-dialog
      title="修改标题"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form 
        ref="headForm"
        label-width="60px"
        size="small"
        style="padding: 0 10px">
        <el-form-item label="标题：">
          <el-input 
            v-model="value.title" 
            :maxlength="60" 
            show-word-limit 
            placeholder="请输入标题">
          </el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input 
            v-model="value.describe" 
            type="textarea"
            show-word-limit
            :rows="3" 
            :maxlength="300">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.stop="dialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Object,
        default: () => {}
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    data () {
      return {
        dialogVisible: false
      }
    },
    methods: {
      bindInput(value) {
        this.$emit('input', value)
        this.$parent.$emit("el.form.change", value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-header {
    padding: 15px 20px 10px 20px;
    cursor: pointer;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    color: #409EFF;
  }
  .describe {
    font-size: 14px;
    text-align: left;
    color: #606266;
    padding: 10px;
  }
</style>
