<template>
  <div>
    <!-- 宽屏页面时内容仅仅占页面宽50%居中显示。窄屏幕时占70%，手机时占100% -->
    <el-col v-loading.fullscreen.lock="loading" :xs="{span:24,offset:0}" :sm="{span:16,offset:4}" :md="{span:12,offset:6}">
      <el-result v-if="notify.type" :icon="notify.type" :title="notify.title" :subTitle="notify.message">
      </el-result>
      <el-card v-else class="test-bg">
        <div class="timer-wrapper" v-if="timer.status">
          <div :class="`timer ${timer.status}`"><li class="el-icon-alarm-clock">{{`${timer.hour}:${timer.min}:${timer.ss}`}}</li></div>
        </div>
        <div slot="header">
          <div class="test-header" v-if="paper.header">
            <div class="title">{{paper.header.title}}</div>
            <div class="describe">{{paper.header.describe}}</div>
          </div>
        </div>
        <el-form 
          :model="test"
          style="padding: 0 20px"
          label-position="top"
          ref="testForm">
          <div :var="num=0">
            <div 
              v-for="(field, index) in paper.content" 
              :key="index">
              <el-form-item
                :prop="`paper.content[${index}].value`"
                :rules="fieldRules(field)">
                <template slot="label">
                  {{(field.hasOwnProperty('score')?(num=num+1)+'.':'')+field.label}}<span class="field-desc">{{field|formatDesc}}</span>
                </template>
                <component
                  :is="'test-'+field.type"
                  :field="field">
                </component>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <el-col :xs="{span:24,offset:0}" :sm="{span:8,offset:8}">
              <el-button type="primary" @click="bindSubmit" style="width:100%">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-dialog
      :visible.sync="submitDialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="25vh"
      :show-close="false">
      <div style="text-align: center">{{submitDialog.text}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitDialog.saving" class="btn-confirm" size="small" @click.stop="bindNotValidSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as items from './form'
import { getTestDetail, submitTestPaper } from '../api/test'
import test from '@/utils/test'
import validate from '@/utils/validate'
import { shuffle, timestamp } from '@/utils/common'
import { TestResultStatus, QuestionType, LimitType } from '@/utils/enum'
import Invigilator from './invigilator'

export default {
  name: 'testPage',
  components: items,
  metaInfo() {
    return {
      title: this.test.title || '线上考试',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }
      ]
    }
  },
  data () {
    return {
      loading: false,
      saving: false,
      test: {},
      paper: {},
      notify: {},
      attach: {},
      timer: {
        hour: '00',
        min: '00',
        ss: '00',
        status: '',
      },
      submitDialog: {
        show: false,
        saving: false,
        status: TestResultStatus.Timeout.value,
        text: ''
      }
    }
  },
  created () {
    const id = this.$route.query.id || this.getTid()
    if(this.test.id = id) {
      this.attach = this.getAttach()
      console.log(this.attach)
      this.getTest()
    } else {
       this.$message.error('缺少关键参数！')
    }
  },
  mounted() {
    window.addEventListener("beforeunload", event => {
      if(this.invigilate) {
        this.invigilate.stop(true)
      }
    })
  },
  destroyed () {
    if(this.invigilate) {
      this.invigilate.stop(true)
    }
  },
  filters: {
    formatDesc(field) {
      const type = QuestionType.getName(field.type)
      const score = field.hasOwnProperty('score')?`（分值：${field.score}分）`:''
      return `${type}${score}`
    }
  },
  methods: {
    getTid() {
      const path = window.location.pathname
      const id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
      return id
    },
    getAttach() {
      const attach = {}
          , search = window.location.search || window.location.hash.substr(1).replace(/^\/+/,'') // 匹配二级域名重写或测试环境带参数URL
      if(search.startsWith('?')) {
        search.substr(1).split('&').forEach(param => {
          let pair = param.split('=')
          let value = decodeURIComponent(pair[1])
          switch(pair[0]) {
            case 'sojumpparm': 
            case 'args': attach.args = value; break
            case 'openid': attach.openid = value; break
            case 'user': 
              attach.user = {}
              value.split('|').forEach((val, index) => {
                if(index == 0) {
                  attach.user.fullname = val
                } else if(index == 1) {
                  attach.user.group = val
                } else if(index == 2) {
                  attach.user.number = val
                }
              }); break
          }
        })
      }
      return attach
    },
    getTest () {
      this.loading = true

      const params = {}
      const { openid } = this.attach
      if(openid) params.openid = openid

      getTestDetail(this.test.id, params).then(res => {
        const data = res.data
        const { paper, notify } = data
        //不能考试通知
        if(notify) {
          this.notify = notify; return
        }
        //处理考题
        if(paper.content) {
          const { random, content } = paper
          //随机考题
          if(random && (random.start || random.end)) {
            const start = (Math.max(random.start, 1) || 1) - 1
            const end = (Math.min(random.end, content.length) || content.length) - 1
            let seeded
            if(!(seeded = paper.seeded)) {
              paper.seeded = seeded = parseInt(new Date().getTime() / 1000)
            }
            shuffle(content, seeded, start, end)
            //删除没被抽到的题
            if(random.num) {
              content.splice(start + random.num, end - start)
            }
          }
          //打散基本信息
          for(let i, field; -1 < (i = content.findIndex(f => f.type == 'basic'));) {
            field = content[i]
            content.splice(i, 1, ...field.props)
          }
          //添加结果字段、生成伪随机选项
          content.forEach(field => {
            // 初始化用户信息
            if(field.name && this.attach.user) {
              field.value = this.attach.user[field.name]
            } else {
              if(field.random) {
                let seeded = field.seeded || (field.seeded = timestamp())
                if(field.options) {
                  shuffle(field.options, seeded, 0, field.options.length - 1)
                }
              }
              if(!field.hasOwnProperty('value') && field.hasOwnProperty('answer')) {
                field.value = test.array(field.answer) ? [] : ''
              }
            }
          })
          //记录考试用时
          this.begintime = timestamp()
        }
        //附加参数
        const { openid, args } = this.attach
        if(args) paper.args = args
        if(openid) paper.openid = openid
        //监考逻辑
        this.invigilate = new Invigilator(
          data.id, 
          data.hash, 
          paper.time_limit, 
          paper.limit_type == LimitType.Browser.value ? paper.submit_limit : 0
        )
        this.invigilate.onRefreshTimer = timer => this.bindProgress(timer)
        this.invigilate.onMessage = msg => this.bindMessage(msg, data)
        this.invigilate.start()
        
        this.test = data
        this.paper = paper
      }).catch(err => console.error(err)).then(() => this.loading = false)
    },
    bindProgress(timer) {
      this.timer.hour = timer.hour,
      this.timer.min = timer.min,
      this.timer.ss = timer.ss,
      this.timer.status = timer.status
    },
    bindMessage(msg) {
      if('max_timeuse' == msg.type) {
        this.timer = ''
        if(!msg.cancel) {
          this.submitDialog.text = `您的考试时间已到，请点击“确定”交卷`
          this.submitDialog.show = true
        }
      } else if('max_times' == msg.type) {
        this.notify.type = 'warning'
        this.notify.title = '考试加载错误'
        this.notify.message = `您的考试次数已达到【${msg.times}】次上限，无法进行考试`
      }
    },
    fieldRules(field) {
      const rules = []
      if(field.required) {
        rules.push({ required: true, message: `此处为必填项！` })
      }
      if(field.rule) {
        const rule = validate.getRule(field.rule)
        if(rule) {
          rules.push(rule)
        } else {
          console.error(field.rule, '验证规则不存在')
        }
      }
      if(0 < field.minlength || 0 < field.maxlength) {
        rules.push({ validator: (rule, value, fun) => {
          const length = test.empty2(value) ? 0 : value.length
              , min = field.minlength || 0
              , max = field.maxlength || 100
          return length >= min && length <= max ? fun() : fun(new Error(`有效填写只能在${min}-${max}字数之间！`))
        }})
      }
      return rules
    },
    bindSubmit() {
      this.$refs.testForm.validate((valid, fields) => {
        if(!valid) {
          this.$nextTick(() => {
            const isError = document.getElementsByClassName('is-error')
            isError[0].scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          })
          return
        }
        this.$confirm('是否提交数据', '提示', { type: 'warning' })
        .then(() => {
          this.loading = true
	        this.test.status = TestResultStatus.Submitted.value
          submitTestPaper(this.test)
            .then(res => this.submitDone(res.data))
            .catch(err => console.error(err))
            .then(() => this.loading = false)

        }).catch(()=>{});
      })
    },
    bindNotValidSubmit() {
      this.submitDialog.saving = true
      this.test.status = this.submitDialog.status
      submitTestPaper(this.test)
        .then(res => this.submitDone(res.data))
        .catch(err => console.error(err))
        .then(() => {
          this.submitDialog.saving = false
          this.submitDialog.show = false
        })
    },
    submitDone(result) {
      this.invigilate.submited(!result.notify)
      //考试错误通知
      if(result.notify) {
        this.notify = result.notify; return
      }
      if(result.rid) {
        this.$router.push({ path: 'paper', query: { id: result.rid } })
      } else {
        this.postWJXFormatData(result)
      }
    },
    postWJXFormatData(result) {
      const form = document.createElement('form')
      form.style = "display:none;"
      form.method = 'post'
      form.action = result.url
      const content = document.createElement('input')
      content.type = 'hidden'
      content.name = 'content'
      content.value = result.content
      form.appendChild(content)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  }
}
</script>

<style lang="scss">
  .test-bg {
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
        padding: 15px 20px 0 20px;
        color: #606266;
      }
    }
    .tips {
      font-size: 14px;
      line-height: 1.5;
      color: #909399;
      padding-bottom: 5px;
    }
  }
  .field-desc {
    font-size: 14px;
    color: #909399;
    font-weight: normal;
    margin-left: 5px;
  }
  .el-form-item__label {
    line-height: 1.5;
    font-weight: bold;
  }
  @media screen and (max-width: 750px) {
    .el-message-box, .el-dialog {
      width: 80% !important;
    }
    .dialog-footer {
      .btn-confirm {
        width: 100%;
      }
    }
    .timer-wrapper {
      .timer {
        border: 1px solid #d9ecff;
        background-color: #ecf5ff;
        color: #409eff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 5px;
        position: fixed;
        z-index: 100;
        right: 15px;
        bottom: 10px;
        text-align: center;
      }
      .danger {
        border: 1px solid #FDE2E2;
        background-color: #FEF0F0;
        color: #F56C6C;
      }
    }
  }
   @media screen and (min-width: 750px) {
    .el-dialog {
      width: 35% !important;
    }
    .timer-wrapper {
      position: fixed;
      .timer {
        border: 1px solid #d9ecff;
        background-color: #ecf5ff;
        color: #409eff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 5px;
        position: absolute;
        z-index: 100;
        top: 135px;
        right: 30px;
        text-align: center;
      }
    }
  }
</style>
