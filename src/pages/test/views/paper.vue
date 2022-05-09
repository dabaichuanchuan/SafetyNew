<template>
  <!-- 宽屏页面时内容仅仅占页面宽50%居中显示。窄屏幕时占70%，手机时占100% -->
  <el-col v-loading.fullscreen.lock="loading" :xs="{span:24,offset:0}" :sm="{span:16,offset:4}" :md="{span:12,offset:6}">
    <el-card v-if="paper.header" class="paper-bg">
      <div slot="header">
        <div class="test-header">
          <div class="title">{{paper.header.title}}</div>
          <div class="describe">考试结果</div>
        </div>
      </div>
      <div class="body">
        <el-descriptions 
          :column="3" 
          direction="vertical"
          size="small"
          labelClassName="lbl" 
          contentClassName="cnt"
          border>
          <el-descriptions-item :label="labels.name" :span="1+!result.group+!result.number">
            {{result.fullname||result.openid}}
          </el-descriptions-item>
          <el-descriptions-item v-if="result.group" :label="labels.group" contentClassName="cnt-second">
            {{result.group}}
          </el-descriptions-item>
          <el-descriptions-item v-if="result.number" :label="labels.number" contentClassName="cnt-second">
            {{result.number}}
          </el-descriptions-item>
          <el-descriptions-item v-if="result.other" :span="3" :label="labels.other" contentClassName="cnt-second">
            {{result.other}}
          </el-descriptions-item>
          <el-descriptions-item :label="`成绩（总分${result.total}）`" :span="2">
            <span class="score">{{result.score}}</span>
          </el-descriptions-item>
          <el-descriptions-item :label="`答对（共${paper.quest_count}题）`">
            <span class="correct">{{paper.quest_count-paper.wrong_count}}</span>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="paper.ranking" class="more-bg">
          <el-button type="text" @click.stop="bindGoRanking">查看排行<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
        </div>
        <div v-if="paper.show_paper" class="questions-bg" :var="i=0">
          <el-form
            style="padding: 0 20px"
            label-position="top"
            ref="paperForm">
            <div 
              v-for="(field, index) in paper.content" 
              :key="index">
              <el-form-item
                :label="field.hasOwnProperty('score')?`${(i=i+1)}.${field.label}`:field.label"
                :prop="`paper.content[${index}].value`">
                <component paper
                  :is="'test-'+field.type"
                  :field="field">
                </component>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
    <div class="debug-note">{{result.openid}}【{{result.submit|formatTime}}】</div>
  </el-col>
</template>

<script>
import * as items from './form'
import { getTestResult } from '../api/test'
import { formatDateTime } from '@/utils/common'

export default {
  name: 'resultPage',
  components: items,
  metaInfo() {
    return {
      title: '考试结果',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }
      ]
    }
  },
  data () {
    return {
      loading: false,
      labels: {
        name: '标识',
        group: '',
        number: '',
        other: '其他信息'
      },
      result: {}
    }
  },
  computed: {
    paper() {
      return this.result ? this.result.paper || {} : {}
    }
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
    }
  },
  created () {
    const id = this.$route.query.id
    if(this.result.id = id) {
      this.getTest()
    } else {
       this.$message.error('缺少关键参数！')
    }
  },
  methods: {
    getTest () {
      this.loading = true
      getTestResult(this.result.id).then(res => {
        const data = res.data
        if(data.paper) {
          if('0' == this.$route.query.r) {
            data.paper.ranking = false
          }
          if('1' == this.$route.query.p) {
            data.paper.show_paper = true
          }
          if(data.paper.content) {
            const { content } = data.paper
            content.forEach(field => {
              //读取用户信息标题
              if('userinfo' == field.type) {
                if(field.value == data.fullname) {
                  this.labels.name = field.label
                } else if(data.group && field.value == data.group) {
                  this.labels.group = field.label
                } else if(data.number && field.value == data.number) {
                  this.labels.number = field.label
                }
              }
            })
          }
        }
        this.result = data
      }).catch(err => console.error(err)).then(() => this.loading = false)
    },
    bindGoRanking() {
      this.$router.push({name:'ranking', params:{ tid: this.result.tid, result: this.result }})
    }
  }
}
</script>

<style lang="scss">
  .paper-bg {
    margin-bottom: 10px;
    .test-header {
      margin: 10px 0 0 0;
      .title {
        font-weight: bold;
        font-size: 20px;
        text-align: center;
        color: #409EFF;
      }
      .describe {
        font-size: 14px;
        padding: 15px 20px 0 5px;
        color: #606266;
      }
    }
    .body {
      .lbl, .cnt {
        text-align: center;
      }
      .cnt {
        font-size: 18px;
      }
      .cnt-second {
        text-align: center;
        font-size: 12px;
      }
      .score {
        font-size: 40px;
        color: #409EFF;
        display: inline-block;
      }
      .correct {
        font-size: 30px;
      }
    }
  }
  .more-bg {
    text-align: right;
  }
  .questions-bg {
    margin-top: 10px;
  }
  .el-form-item__label {
    line-height: 1.5;
    font-weight: bold;
  }
  @media screen and (max-width: 750px) {
    .el-message-box {
      width: 70% !important;
    }
  }
</style>
