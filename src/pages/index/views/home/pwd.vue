<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>修改登录密码</span>
    </div>
    <el-form 
      :model="model"
      ref="userForm"
      :rules="rules"
      label-width="120px">
      <el-form-item label="旧登录密码：" prop="oldpass">
        <el-input 
          v-model="model.oldpass"
          type="password">
        </el-input>
      </el-form-item>
      <el-form-item label="新登录密码：" prop="newpass">
        <el-input 
          v-model="model.newpass" 
          type="password">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirm">
        <el-input 
          v-model="model.confirm" 
          type="password">
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" style="width:100%" :loading="loading" @click="bindSubmit">确认修改</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import { changePassword } from '../../api/manager/user'

const defaultModel = {
  oldpass: '',
  newpass: '',
  confirm: ''
}

export default {
  name: 'pwd',
  data() {
    return {
      loading: false,
      model: Object.assign({}, defaultModel),
      rules: {
        oldpass: [
          { required: true, message: '必填项！' }
        ],
        newpass: [
          { required: true, message: '必填项！' }
        ],
        confirm: [
          { required: true, message: '必填项！' }
        ]
      }
    }
  },
  methods: {
    bindSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true
          changePassword(this.model).then(res => {
            this.$refs.userForm.resetFields()
            if(res.data) {
              this.$message.success('修改登录密码成功')
            } else {
              this.$message.error('旧登录密码错误')
            }
          }).catch(() => {}).then(() => this.loading = false)
        } else {
          this.$message.error('验证失败')
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .box-card {
    width: 480px;
    margin: 50px auto 0 auto;
  }
</style>