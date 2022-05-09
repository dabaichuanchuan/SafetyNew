<template>
  <div>
    <div class="login-bg">
      <img :src="login_center_bg">
    </div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <h2 class="login-title color-main">安全履职系统登录</h2>
        <el-form-item prop="account">
          <el-input name="account"
                    type="text"
                    v-model="loginForm.account"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
          <span slot="suffix" @click="handleShowPwd">
            <svg-icon v-if="pwdType=='password'" icon-class="eye" class="color-main"></svg-icon>
            <svg-icon v-else icon-class="eyeslash" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-btn-area">
            <el-button type="primary" style="width:100%" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Cookies from "js-cookie"
import login_center_bg from '../../assets/login_center_bg.png'

export default {
  name: 'pwdLogin',
  data() {
      return {
        loginForm: {
          account: '',
          password: '',
        },
        loginRules: {
          account: [{required: true, trigger: 'blur', message: '必须输入用户名'}],
          password: [{required: true, trigger: 'blur', message: '必须输入密码'}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
      }
    },
    created() {
      this.loginForm.account = Cookies.get("account")
      this.loginForm.password = Cookies.get("password")
    },
    methods: {
      handleShowPwd() {
        this.pwdType = this.pwdType == 'password' ? '' : 'password'
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (!valid) return
          this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              Cookies.set("account", this.loginForm.account, { expires: 15 });
              Cookies.set("password", this.loginForm.password, { expires: 15 });
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
        })
      }
    }
  }
</script>

<style scoped>
  .login-bg {
    background: #409EFF;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -180px;
    width: 100%;
    height: 360px;
  }
  .login-form-layout {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: -230px auto 0 auto;
    width: 360px;
    border-top: 10px solid #409EFF;
  }
  .login-title {
    text-align: center;
  }
  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }

  .login-btn-area {
    text-align: center;
  }
</style>
