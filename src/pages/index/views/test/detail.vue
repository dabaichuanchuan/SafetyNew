<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="6">
        <el-card class="form-bg" shadow="hover">
          <div slot="header" class="clearfix">
            <span>表单项</span>
          </div>
          <el-divider class="line">人员信息</el-divider>
          <el-row class="row">
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'fullname')"><svg-icon icon-class="form-fullname" class="icon"></svg-icon>考生姓名</el-button>
            </el-col>
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'group')"><svg-icon icon-class="form-group" class="icon"></svg-icon>考生部门</el-button>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'number')"><svg-icon icon-class="form-number" class="icon"></svg-icon>考生号码</el-button>
            </el-col>
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'other')"><svg-icon icon-class="form-other" class="icon"></svg-icon>其他信息</el-button>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="24">
              <el-button round size="small" @click.stop="addField($event, 'basic')"><svg-icon icon-class="form-base" class="icon"></svg-icon>基本信息</el-button>
            </el-col>
          </el-row>
          <el-divider class="line">考试题型</el-divider>
          <el-row class="row">
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'radio')"><svg-icon icon-class="form-radio" class="icon"></svg-icon>考试单选</el-button>
            </el-col>
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'judge')"><svg-icon icon-class="form-judge" class="icon"></svg-icon>考试判断</el-button>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'checkbox')"><svg-icon icon-class="form-checkbox" class="icon"></svg-icon>考试多选</el-button>
            </el-col>
            <el-col :span="12">
              <el-button round size="small" @click.stop="addField($event, 'single')"><svg-icon icon-class="form-single" class="icon"></svg-icon>单项填空</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="test-bg" v-loading="loading" shadow="hover">
          <div slot="header" class="clearfix">
            <span>试卷编制</span>
            <div style="float:right">
              <span>总分：{{totalScore}}</span>
              <el-divider direction="vertical"></el-divider>
              <span>考题数：{{totalField}}</span>
              <el-divider direction="vertical"></el-divider>
              <import-excel type="text" style="padding: 3px 0" 
                @upload-review="bindUploadReview" 
                @upload-confirm="bindUploadConfirm" 
                @upload-cancel="bindUploadCancel">
                <el-table slot="preview" border
                  :data="fields"
                  height="400"
                  size="small">
                  <el-table-column width="80" label="题型" align="center">
                    <template slot-scope="scope">{{scope.row.type|formatQuestionType}}</template>
                  </el-table-column>
                  <el-table-column width="60" label="分值" align="center">
                    <template slot-scope="scope">{{scope.row.score}}</template>
                  </el-table-column>
                  <el-table-column width="380" label="题目" align="left">
                    <template slot-scope="scope">{{scope.row.label}}</template>
                  </el-table-column>
                  <el-table-column label="答案" align="left">
                    <template slot-scope="scope">{{scope.row|formatQuestionAnswer}}</template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="60">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click.stop="bindRemoveQuestion(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </import-excel>
              <el-divider direction="vertical"></el-divider>
              <el-button style="padding: 3px 0" type="text" icon="el-icon-s-tools" @click.stop="bindShowConfigDialog">参数设置</el-button>
            </div>
          </div>
          <div class="paper">
            <test-header class="field" v-model="test.paper.header"></test-header>
            <div class="content" :var="num=0">
              <div v-for="(field, index) in test.paper.content"
                class="field"
                :key="index">
                <component
                  :is="'test-'+field.type"
                  :edit="index==editIndex"
                  :index="num=num+1"
                  @end-edit="editIndex=-1"
                  :field="field">
                </component>
                <field-oper-panel class="oper" :index="index" @field-oper="bindFieldOper"></field-oper-panel>
              </div>
            </div>
            <div class="footer">
              <el-button type="primary" size="small" icon="el-icon-document-checked" :loading="!!(saving&1)" @click.stop="bindSave">保存</el-button>
              <el-button type="success" v-if="showPublish" size="small" icon="el-icon-tickets" :loading="!!(saving&2)" @click.stop="bindPublish">发布</el-button>
              <!-- <el-button size="small" v-if="test.id" icon="el-icon-view" @click.stop="bindPreview">预览</el-button> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="试卷设置"
      :visible.sync="configDialog.show"
      width="45%">
      <el-form 
        ref="configForm"
        label-width="100px"
        size="small"
        :model="configDialog.model"
        :rules="configDialog.rules"
        style="padding: 0 10px">
        <el-form-item label="定时任务：" prop="timer.end">
          <el-date-picker
            v-model="configDialog.model.timer.start"
            type="datetime"
            style="width:200px"
            clearable
            placeholder="开始时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="configDialog.model.timer.end"
            type="datetime"
            style="width:200px"
            clearable
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="随机内容：">
          从
          <el-input-number v-model="configDialog.model.random.start" style="width:90px" controls-position="right" :min="0" :max="100"></el-input-number>
          至
          <el-input-number v-model="configDialog.model.random.end" style="width:90px" controls-position="right" :min="0" :max="100"></el-input-number>
          取
          <el-input-number v-model="configDialog.model.random.num" style="width:90px" controls-position="right" :min="0" :max="100"></el-input-number>
          <el-tooltip class="item" effect="dark" content="根据表单项序号（包含人员信息）进行范围随机抽取，小于范围的表单项将会保留，大于范围的将会忽略！" placement="top">
            <el-tag size="medium" style="margin-left: 10px">题 <i class="el-icon-question"></i></el-tag>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="显示排行：">
          <el-input-number 
            v-model="configDialog.model.ranking" 
            placeholder="前几名" 
            :min="0" :max="1000">
          </el-input-number>
          <el-tooltip class="item" effect="dark" content="设置后显示排行榜，排序方式根据得分与答卷时间，答卷时间由于网络原因可能发生延迟！" placement="top">
            <el-tag size="medium" style="margin-left: 10px">名 <i class="el-icon-question"></i></el-tag>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="提交限制：">
          <el-input-number 
            v-model="configDialog.model.submit_limit" 
            :step="1"
            placeholder="次" 
            :min="0" :max="999">
          </el-input-number>
          <el-radio-group v-if="configDialog.model.submit_limit" style="margin-left:10px" v-model="configDialog.model.limit_type" size="mini">
            <el-radio-button 
              v-for="(option, index) in configDialog.limitTypeOptions" 
              :key="index"
              :label="option.value">
              {{option.name}}
            </el-radio-button>
          </el-radio-group>
          <el-tooltip class="item" effect="dark" content="限制该试卷每台设备可以提交几次（更新试卷内容次数重置），选择浏览器方式依赖Cookie状态可能失效，嵌入App方式需要传递openid参数。" placement="top">
            <el-tag size="medium" style="margin-left: 10px">次 <i class="el-icon-question"></i></el-tag>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="作答时间：">
          <el-input-number 
            v-model="configDialog.model.time_limit" 
            :step="5"
            placeholder="秒" 
            :min="0" :max="9999">
          </el-input-number>
          <el-tooltip class="item" effect="dark" content="限制该试卷作答时间，由于网页技术限制目前尚不支持续考功能！（每次刷新会重置时间）" placement="top">
            <el-tag size="medium" style="margin-left: 10px">秒 <i class="el-icon-question"></i></el-tag>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="作答回顾：">
          <el-switch
            v-model="configDialog.model.show_paper">
          </el-switch>
        </el-form-item>
        <el-form-item label="跳转地址：" prop="post_url">
          <el-input
            v-model="configDialog.model.post_url" 
            placeholder="请填写考试后提交成绩的地址">
            <template slot="prepend"><el-checkbox v-model="configDialog.model.enable_post">启用</el-checkbox></template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.stop="bindModifyConfig">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="操作提示"
      :visible.sync="alertDialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px">
      <el-alert
        title="编辑试卷警告"
        type="warning"
        :closable="false"
        :description="alertDialog.message"
        show-icon>
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="bindCancelEdit">取 消</el-button>
        <el-button type="warning" size="small" :loading="alertDialog.updating" @click.stop="bindPauseTest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as items from './form'
import { getTestDetail, saveTestDetail, modifyTestStatus } from '../../api/test'
import { TestStatus, QuestionType, LimitType } from '@/utils/enum'
import test from '@/utils/test'
import validate from '@/utils/validate' 
import FieldOperPanel from './form/field-oper-panel.vue'
import ImportExcel from '../../components/Excel/import.vue'

const defTestConfig = {
  timer: {
    start: '',
    end: '',
  },
  random: {
    start: '',
    end: '',
    num: '',
  },
  ranking: 0,
  submit_limit: '',
  limit_type: 0,
  time_limit: 0,
  show_paper: true,
  post_url: '',
  enable_post: false,
}

const defTestModel = {
  id: '',
  paper: {
    header: {
      title: '新试卷标题',
      describe: ''
    },
    content: [],
    ...defTestConfig
  }
}

export default {
  name: 'detailPage',
  components: { ...items, FieldOperPanel, ImportExcel },
  data () {
    return {
      loading: false,
      saving: 0,
      test: JSON.parse(JSON.stringify(defTestModel)),
      configDialog: {
        show: false,
        model: JSON.parse(JSON.stringify(defTestConfig)),
        limitTypeOptions: LimitType.items(),
        rules: {
          'post_url': [ validate.getRule('url') ]
        }
      },
      alertDialog: {
        show: false,
        title: '',
        message: '',
        updating: false,
      },
      editIndex: -1,
      fields: []
    }
  },
  computed: {
    totalScore() {
      return this.test.paper.content.reduce((total, field) => total += field.score || 0, 0)
    },
    totalField() {
      return this.test.paper.content.reduce((total, field) => total += field.hasOwnProperty('score') ? 1 : 0, 0)
    },
    showPublish() {
      return this.test.id && [TestStatus.Waiting.value, TestStatus.Paused.value].includes(this.test.status)
    }
  },
  filters: {
    formatQuestionType(type) {
      return QuestionType.getName(type)
    },
    formatQuestionAnswer(question) {
      if(question.options) {
        let answer = question.options.reduce((total, option) => {
          if(test.array(question.answer) && question.answer.includes(option)) {
            total += '（√）'
          } else if(option == question.answer) {
            total += '（√）'
          }
          total += option + ' | '
          return total
        }, '')
        return answer.substring(0, answer.lastIndexOf('|'))
      } else {
        return question.answer
      }
    }
  },
  created () {
    if(this.test.id = this.$route.query.id) {
      this.loadTest()
    }
  },
  methods: {
    addField(event, type) {
      let field
      switch (type) {
        case 'basic': field = {
          type: 'basic',
          props: [
            {
              label: '您的姓名：',
              type: 'userinfo',
              name: 'fullname',
              tips: '',
              rule: 'fullname',
              required: true,
              maxlength: 30,
              minlength: 0,
            },
            {
              label: '您的组织：',
              type: 'userinfo',
              name: 'group',
              tips: '',
              rule: 'cnOrNum',
              required: true,
              maxlength: 100,
              minlength: 0
            },
            {
              label: '您的编号：',
              type: 'userinfo',
              name: 'number',
              tips: '',
              rule: 'enOrNum',
              required: true,
              maxlength: 100,
              minlength: 0
            }
          ]
        }; break
        case 'fullname': field = {
          label: '您的姓名：',
          type: 'userinfo',
          name: 'fullname',
          tips: '',
          rule: 'fullname',
          required: true,
          maxlength: 30,
          minlength: 0
        }; break
        case 'group': field = {
          label: '您的部门：',
          type: 'userinfo',
          name: 'group',
          tips: '',
          rule: 'cnOrNum',
          required: true,
          maxlength: 100,
          minlength: 0
        }; break
        case 'number': field = {
          label: '您的编号：',
          type: 'userinfo',
          name: 'number',
          tips: '',
          rule: 'enOrNum',
          required: true,
          maxlength: 100,
          minlength: 0
        }; break
        case 'other': field = {
          label: '其他信息：',
          type: 'userinfo',
          name: 'other',
          tips: '',
          rule: '',
          required: true,
          maxlength: 100,
          minlength: 0
        }; break
        case 'single': field = {
          label: '标题：',
          type: 'single',
          tips: '',
          required: true,
          score: 5,
          maxlength: 100,
          minlength: 0,
          answer: ''
        }; break
        case 'radio': field = {
          label: '标题：',
          type: 'radio',
          tips: '',
          required: true,
          value: '',
          score: 5,
          random: false,
          options: ['选项1','选项2'],
          answer: '选项1'
        }; break
        case 'judge': field = {
          label: '标题：',
          type: 'judge',
          tips: '',
          required: true,
          value: '',
          score: 5,
          options: ['是','否'],
          answer: '是'
        }; break
        case 'checkbox': field = {
          label: '标题：',
          type: 'checkbox',
          tips: '',
          required: true,
          value: [],
          score: 5,
          random: false,
          options: ['选项1','选项2'],
          answer: ['选项1','选项2']
        }; break
      }
      if(!field) return
      this.test.paper.content.push(field)
    },
    bindFieldOper(index, name) {
      const content = this.test.paper.content
      this.editIndex = -1
      switch (name) {
        case 'up': 
          if(!index) return
          content[index] = content.splice(index - 1, 1, content[index])[0]; break
        case 'first':
          if(!index) return
          content.unshift(content.splice(index , 1)[0]); break
        case 'down':
          if(index == content.length - 1) return
          content[index] = content.splice(index + 1, 1, content[index])[0]; break
        case 'last':
          if(index == content.length - 1) return
          content.push(content.splice(index , 1)[0]); break
        case 'remove':
          content.splice(index, 1); break
        case 'copy':
          content.splice(index + 1, 0, Object.assign({}, content[index])); break
        case 'edit':
          this.editIndex = index; break
      }
    },
    loadTest() {
      this.loading = true
      getTestDetail(this.test.id).then(res => {
        this.loading = false
        this.test = res.data
        if(this.test.status == TestStatus.Published.value) {
          let message = '当前试卷正在运行，如需编辑请点击“确定”，系统将【暂停】该问卷！'
          if(this.test.answer) {
            message += `且当前试卷已存在${this.test.answer}个答卷，如修改相关题目将影响统计，请知悉。`
          }
          this.alertDialog.message = message
          this.alertDialog.show = true
        }
      })
    },
    bindPauseTest() {
      this.alertDialog.updating = true
      modifyTestStatus(this.test.id, TestStatus.Paused.value).then(res => {
        if(res.data) {
          this.alertDialog.show = false
          this.test.status = TestStatus.Paused.value
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
          this.$router.push({path:'/test/index'})
        }
      })
    },
    bindCancelEdit() {
      this.$router.go(-1)
    },
    bindSave() {
      const userinfo = ['userinfo', 'basic']
      new Promise((resolve, reject) => {
        if(!this.test.paper.content.some(f => userinfo.includes(f.type))) {
          this.$confirm('未添加“人员信息”填写字段，是否保存？', '提示', { type: 'warning' })
          .then(resolve).catch(reject)
        } else {
          resolve()
        }
      }).then(() => {
        this.saving |= 1
        saveTestDetail(this.test).then(res => {
          this.test.id = res.data
          if(!this.test.status) {
            this.test.status = TestStatus.Waiting.value
          }
          this.$message.success('保存试卷成功')
        }).catch(()=>{}).then(() => this.saving &= ~1)
      })
    },
    bindShowConfigDialog() {
      this.configDialog.model = Object.assign({}, this.test.paper)
      this.configDialog.show = true
      this.$nextTick(() => this.$refs.configForm.clearValidate())
    },
    bindModifyConfig() {
      this.$refs.configForm.validate(valid => {
        if (valid) {
          Object.assign(this.test.paper, this.configDialog.model)
          this.configDialog.show = false
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    bindPublish() {
      this.saving |= 2
      modifyTestStatus(this.test.id, TestStatus.Published.value).then(res => {
        this.saving &= ~2
        if(res.data) {
          this.$message.success('发布成功')
          this.$router.push({path:'/test/index'})
        } else {
          this.$message.error('发布失败')
        }
      })
    },
    bindPreview() {
      window.open(`/test.html#/?id=${this.test.id}`)
    },
    bindUploadReview(data) {
      const errors = []
      data.forEach((item, index) => {
        try {
          let field = {
            type: QuestionType.getValue(item['题型']),
            score: parseFloat(item['分值']),
            label: item['题目'],
            required: true,
            tips: ''
          }
          let options = [], option
          Object.keys(item).forEach(key => {
            if(key.startsWith('选项') && (option = item[key])) {
              options.push(String(option))
            }
          })
          if(options.length) {
            field.options = options
            let values = item['正确答案'].split('').map(letter => {
              return options[letter.toUpperCase().charCodeAt() - 65]
            })
            if('checkbox' == field.type) {
              field.answer = values
              field.value = []
            } else {
              field.answer = values[0]
              field.value = ''
            }
          } else {
            field.answer = item['正确答案']
            field.value = ''
            if('judge' == field.type && ['对','错'].includes(field.answer)) {
              field.options = ['对','错']
            }
          }
          if('single' == field.type) {
            field.minlength = 0
            field.maxlength = 100
          }
          this.fields.push(field)
        } catch(err) {
          console.error(err)
          errors.push(index + 1)
        }
        if(errors.length) {
          this.$message({
            message: `考题导入错误，第【${errors.join('，')}】行！`,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    bindUploadCancel() {
      this.fields.splice(0, this.fields.length)
    },
    bindUploadConfirm() {
      this.test.paper.content = this.test.paper.content.concat(this.fields)
      this.fields.splice(0, this.fields.length)
    },
    bindRemoveQuestion(index) {
      this.fields.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
  .form-bg {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 20px;
    .row {
      margin: 0 0 10px 0;
      text-align: center;
    }
  }
  .test-bg {
    margin: 0 0 0 10px;
    .paper {
      margin: 0 auto;
      .field {
        border-radius: 10px;
        overflow: hidden; // Fix chrome子元素无法撑开父元素BUG
        .oper {
          display: none;
        }
        .desc {
          color: #F56C6C;
        }
      }
      .field:hover {
        background-color: #FAFAFA;
        .oper {
          display: block;
        }
      }
      .footer {
        text-align: center;
        margin: 15px 0;
      }
    }
  }
  .icon {
    margin-right: 5px;
  }
  .line .el-divider__text{
    font-size: 12px;
    color: #909399;
  }
</style>