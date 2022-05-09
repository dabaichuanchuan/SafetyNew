<template>
  <div class="test-oper">
    <el-button-group style="margin-right:10px">
      <el-button size="mini" icon="el-icon-edit" @click.stop="bindClick('edit')">编辑</el-button>
      <el-button size="mini" icon="el-icon-document-copy" @click.stop="bindClick('copy')">复制</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" @click.stop="bindClick('remove')">删除</el-button>
    </el-button-group>
    <el-button-group>
      <el-button size="mini" icon="el-icon-arrow-up" @click.stop="bindClick('up')">上移</el-button>
      <el-button size="mini" icon="el-icon-arrow-down" @click.stop="bindClick('down')">下移</el-button>
      <el-button size="mini" icon="el-icon-top" @click.stop="bindClick('first')">最前</el-button>
      <el-button size="mini" icon="el-icon-bottom" @click.stop="bindClick('last')">最后</el-button>
    </el-button-group>
  </div>
</template>
<script>
  export default {
    props: {
      index: {
        type: Number
      }
    },
    data () {
      return {
      }
    },
    methods: {
      bindClick(name) {
        this.$emit(`field-oper`, this.index, name)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-oper {
    text-align: right;
    padding: 10px 20px 20px 20px;
  }
</style>
