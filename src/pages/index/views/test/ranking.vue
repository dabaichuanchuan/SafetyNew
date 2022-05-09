<template>
  <el-card class="form-container" shadow="hover" v-loading="loading">
    <div slot="header" class="clearfix">
      <div>考试成绩排行榜</div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="13">
          <div class="ranking-webview">
            <iframe :src="url" frameborder="no" border="0" class="iframe"></iframe>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="test-title">{{test.title}}</div>
          <div class="text_describe">{{test.ranking?`排行显示前 ${test.ranking} 名`:'未开启排行功能'}}</div>
          <el-divider content-position="left">操作</el-divider>
          <div class="input-url">
            <el-input size="small" v-model="url" disabled>
              <el-button 
                slot="append"
                icon="el-icon-copy-document"
                size="small"
                v-clipboard:copy="url"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">
                  复制
              </el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
  import { getTestDetail, genRankingUrl } from '../../api/test'

  export default {
    data () {
      return {
        loading: false,
        test: {},
        url: ''
      }
    },
    created () {
      if(this.test.id = this.$route.query.id) {
        this.getTest()
      }
    },
    methods: {
      getTest() {
        this.loading = true
        getTestDetail(this.test.id).then(res => {
          this.test = res.data
          this.url = genRankingUrl(this.test.id)
        }).catch(() => {}).then(() => this.loading = false)
      },
      onCopySuccess() {
        this.$message.success('复制成功')
      },
      onCopyError() {
        this.$message.error('复制失败')
      },
      bindOpenUrl() {
        window.open(this.url)
      }
    }
  }
</script>
<style lang="scss">
  .ranking-webview {
    width: 414px;
    height: 600px;
    overflow: hidden;
    position: relative;
    .iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .el-scrollbar__wrap{ 
    overflow-x: hidden; 
  }
  .test-title {
    padding: 15px 0;
    font-size: 18px;
  }
  .text_describe {
    font-size: 14px;
    color: #909399;
  }
  .input-url {
    padding: 10px 0;
    .el-input.is-disabled .el-input__inner {
      background-color: #FFF;
      color: #000;
      cursor: pointer;
    }   
  }
</style>