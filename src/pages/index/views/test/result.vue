<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover" v-loading="searchLoading">
      <div class="icon-area">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div class="button-area">
        <el-switch
          v-model="listQuery.label"
          style="margin-right: 15px;"
          active-text="按标题"
          inactive-text="按考题">
        </el-switch>
        <el-button
          type="primary"
          @click="bindSearchList()"
          size="small">
          搜索
        </el-button>
        <el-button
          @click="bindResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div class="where-area filter">
        <div class="row" v-for="(filter, fidx) in filters" :key="fidx">
          <div class="cell label">{{`条件${fidx+1}：`}}</div>
          <div class="cell field">
            <el-select 
              size="mini" 
              v-model="filter.index" 
              @change="val=>bindFieldChange(val, filter)"
              style="width: 100%;"
              placeholder="请选择">
              <el-option
                v-for="(option, sidx) in searchOptions"
                :key="sidx"
                :label="option.label"
                :value="sidx">
              </el-option>
            </el-select>
          </div>
          <div class="cell logic" v-if="'single'==filter.type">
            <el-select 
              size="mini" 
              v-model="filter.logic" 
              style="width: 100%;"
              placeholder="请选择">
              <el-option
                v-for="(option, lidx) in filter.logicOptions"
                :key="lidx"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </div>
          <div class="cell single" v-if="'single'==filter.type">
            <el-input
              size="mini" 
              v-model="filter.value" 
              style="width: 100%;"
              clearable
              placeholder="请输入值">
            </el-input>
          </div>
          <div class="cell list" v-if="'list'==filter.type">
            <el-select 
              size="mini" 
              v-model="filter.value" 
              style="width: 100%;"
              placeholder="请选择">
              <el-option
                v-for="(option, vidx) in filter.valueOptions"
                :key="vidx"
                :label="option"
                :value="option">
              </el-option>
            </el-select>
          </div>
          <div class="cell oper">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click.stop="bindDelFilter(fidx)"></el-button>
          </div>
        </div>
        <div class="row">
          <div class="add" @click.stop="bindAddFilter">
            <i class="el-icon-circle-plus">增加条件</i>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="table-container" shadow="hover">
      <div class="icon-area">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
      </div>
      <div class="button-area">
        <el-button
          @click="bindDownResult()"
          icon="el-icon-download"
          :loading="downLoading"
          size="mini">
          下载
        </el-button>
        <el-button
          @click="bindClearResult()"
          type="danger"
          icon="el-icon-delete"
          :loading="removeLoading"
          size="mini">
          清空
        </el-button>
      </div>
      <div class="table-area">
        <el-table ref="resultTable"
                  :data="list"
                  style="width: 100%;"
                  size="small"
                  v-loading="listLoading" border>
          <el-table-column label="标识" align="center">
            <template slot-scope="scope">{{scope.row.fullname||scope.row.openid||scope.row.number||scope.row.group}}</template>
          </el-table-column>
          <!-- <el-table-column label="来源" align="center" width="120">
            <template slot-scope="scope">{{scope.row.source}}</template>
          </el-table-column> -->
          <el-table-column label="用时" align="center" width="120">
            <template slot-scope="scope">{{(scope.row.timeuse||0) + '秒'}}</template>
          </el-table-column>
          <el-table-column label="答对" align="center" width="120">
            <template slot-scope="scope">{{`${scope.row.quest_count-scope.row.wrong_count}/${scope.row.quest_count}`}}</template>
          </el-table-column>
          <el-table-column label="得分" align="center" width="120">
            <template slot-scope="scope">{{`${scope.row.score}/${scope.row.total}`}}</template>
          </el-table-column>
          <el-table-column label="成绩" align="center" width="120">
            <template slot-scope="scope">{{scope.row.achv}}</template>
          </el-table-column>
          <el-table-column label="提交" align="center" width="150">
            <template slot-scope="scope">{{scope.row.submit|formatTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-view" @click="bindPaperView(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-area">
        <el-pagination
          background
          @size-change="bindSizeChange"
          @current-change="bindCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="查看试卷"
      :visible.sync="dialogPaper.show"
      width="50%">
      <div class="paper-webview">
        <iframe ref="webview" :src="dialogPaper.url" frameborder="no" border="0" class="iframe"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.stop="dialogPaper.show=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getTestDetail, getTestResultPage, genPaperUrl, removeTestResult, downTestResult } from '../../api/test'
  import { formatDateTime } from '@/utils/common'
  import test from '@/utils/test'

  const defaultListQuery = {
    tid: '',
    status: '',
    filters: [],
    label: false,
    pageNum: 1,
    pageSize: 5
  }

  const singleSearchLogic = [
    { label: '等于', value: 'eq' },
    { label: '不等于', value: 'neq' },
    { label: '包含', value: 'lik' },
    { label: '不包含', value: 'nlik' }
  ]

  export default {
    name: 'testList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: [],
        total: 0,
        listLoading: false,
        searchLoading: false,
        searchOptions: [],
        removeLoading: false,
        downLoading: false,
        filters: [],
        dialogPaper: {
          show: false,
          url: ''
        }
      }
    },
    created() {
      if(this.$route.query.id) {
        defaultListQuery.tid = this.listQuery.tid = this.$route.query.id
        this.loadSearchOptions()
        this.getList()
      }
    },
    filters: {
      formatTime(time) {
        return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
      }
    },
    methods: {
      loadSearchOptions() {
        this.searchLoading = true
        getTestDetail(this.listQuery.tid).then(res => {
          if(!res.data) {
            this.$message.error('试卷不存在'); return
          } 
          const content = res.data.paper.content
          for(let i, field; -1 < (i = content.findIndex(f => f.type == 'basic'));) {
            field = content[i]
            content.splice(i, 1, ...field.props)
          }
          this.searchOptions = content.map(field => {
            const option = {
              label: field.label,
              key: field.key,
              cate: field.name ? 'userinfo' : 'question'
            }
            if(field.options) {
              option.type = 'list'
              option.logic = test.array(field.answer) ? { label: '包含', value: 'in' } : { label: '等于', value: 'eq' }
              option.options = field.options.concat(['【未选择】'])
            } else {
              option.type = 'single'
              option.logic = singleSearchLogic
            }
            return option
          }).concat([
            {
              label: '来源',
              key: 'source',
              type: 'single',
              cate: 'system',
              logic: singleSearchLogic
            }
          ])
          this.searchLoading = false
        })
      },
      getList(paged) {
        if(!paged) this.listQuery.pageNum = 1
        this.listLoading = true
        this.listQuery.filters = this.genFilters()
        getTestResultPage(this.listQuery).then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
      },
      genFilters() {
        return this.filters.filter(item => {
          return test.notEmpty(item.key) && test.notEmpty(item.cate) && test.notEmpty(item.logic)
        }).map(item => {
          let value = '【未选择】' == item.value ? '' : item.value
          let logic = item.logic
          if(!value) {
            if('eq' == logic || 'lik' == logic || 'in' == logic) {
              logic = 'nul'
            } else {
              logic = 'nnul'
            }
          }
          return {
            key: this.listQuery.label ? item.label : item.key,
            cate: item.cate, 
            logic: logic, 
            value: value
          }
        })
      },
      bindFieldChange(index, filter) {
        const option = this.searchOptions[index]
        filter.type = option.type
        filter.label = option.label
        filter.key = option.key
        filter.cate = option.cate
        switch(option.type) {
          case 'list': Object.assign(filter, {
            logicOptions: null,
            valueOptions: option.options,
            logic: option.logic.value,
            value: ''
          }); break
          case 'single': Object.assign(filter, {
            logicOptions: option.logic,
            valueOptions: null,
            logic: '',
            value: ''
          }); break
        }
      },
      bindAddFilter() {
        this.filters.push({
          index: '',
          type: '',
          label: '',
          key: '',
          logic: '',
          value: '',
        })
      },
      bindDelFilter(index) {
        this.filters.splice(index, 1)
      },
      bindSearchList() {
        this.getList()
      },
      bindResetSearch() {
        this.filters.splice(0, this.filters.length)
        this.listQuery = Object.assign(this.listQuery, defaultListQuery)
      },
      bindSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      bindCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList(true)
      },
      bindPaperView(row) {
        //强制刷新iframe（需配合url时间戳）
        if(this.$refs.webview) {
          this.$refs.webview.contentWindow.location.reload(true)
        }
        this.dialogPaper.url = genPaperUrl(row.id, { p: 1, r: 0 }, true)
        this.dialogPaper.show = true
      },
      bindClearResult() {
        this.$confirm('将清空所有考试成绩，清空后无法还原，是否继续？', '提示', { type: 'warning' })
        .then(() => {
          this.removeLoading = true
          removeTestResult(this.listQuery.tid).then(res => {
            this.removeLoading = false
            const record = res.data
            if(record) {
              this.$message.success(`已清除【${record}】条考试成绩相关记录`)
            } else {
              this.$message.error('未清除任何考试成绩')
            }
            this.getList()
          })
        })
        .catch(() => {})
      },
      bindDownResult() {
        this.downLoading = true
        this.listQuery.filters = this.genFilters()
        downTestResult(this.listQuery).then(res => {
          const url = res.data
          this.downLoading = false

          let a = document.createElement('a')
          let event = new MouseEvent('click')
          a.download = '考试成绩'
          a.href = url
          a.dispatchEvent(event)
        })
      }
    }
  }
</script>
<style lang="scss">
  .filter {
    position: relative;
    .row {
      margin-bottom: 10px;
      .add {
        border: 1px dashed #d4d7d9;
        border-radius: 5px;
        font-size: 12px;
        padding: 6px;
        text-align: center;
        cursor: pointer;
        color: #909399;
        width: 650px;
        width: 805px;
      }
      .add:hover {
        border-color: #409EFF;
        color: #409EFF;
      }
      .cell {
        display: inline-block;
      }
      .label {
        font-size: 14px;
      }
      .field {
        width: 350px;
      }
      .logic {
        width: 90px;
      }
      .single {
        width: 255px;
      }
      .list {
        width: 350px;
      }
    }
  }
  .paper-webview {
    width: 100%;
    height: 400px;
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
</style>
