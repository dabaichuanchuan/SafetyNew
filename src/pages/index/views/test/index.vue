<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div class="icon-area">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div class="button-area">
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
      <div class="where-area">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" placeholder="试卷标题/创建人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" clearable placeholder="请选择">
              <el-option
                v-for="item in testStatusOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加时间：">
            <el-date-picker
              v-model="listQuery.create_time"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container" v-loading="listLoading">
      <el-empty v-if="!list||!list.length" description="无内容"></el-empty>
      <el-card class="row" v-for="(test, index) in list" :key="index" shadow="hover" v-loading="index==rowLoading">
        <div slot="header" class="clearfix">
          {{test.title}}
          <div class="test-info">
            标识：{{test.id}}<el-divider direction="vertical"></el-divider>
            <span :class="`test-status${test.status}`">{{test.status|formatStatus}}</span><el-divider direction="vertical"></el-divider>
            答卷：<span class="test-answer">{{test.answer}}</span><el-divider direction="vertical"></el-divider>
            {{test.modified|formatTime}}
            <template v-if="test.account">
              <el-divider direction="vertical"></el-divider>
              {{test.account.fullname}}
            </template>
          </div>
        </div>
        <el-dropdown @command="cmd=>bindResultCommand(cmd, test)">
          <el-button size="mini" icon="el-icon-s-data">
            成绩数据<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="result">查看成绩</el-dropdown-item>
            <el-dropdown-item command="rank">考试排名</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="cmd=>bindReleaseCommand(cmd, test)">
          <el-button size="mini" icon="el-icon-s-promotion">
            发送问卷<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="link">链接与二维码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <power-area class="test-oper" :in="['Test']">
          <template>
            <el-button :loading="!!(test.loading&1)" v-if="isStatusKey(test, 'Waiting','Paused')" size="mini" type="primary" icon="el-icon-video-play" @click="bindModifyStatus(index, 'Published', test)">发布</el-button>
            <el-button :loading="!!(test.loading&2)" v-else-if="isStatusKey(test, 'Published')" size="mini" icon="el-icon-video-pause"  @click="bindModifyStatus(index, 'Paused', test)">暂停</el-button>
            <el-button :loading="!!(test.loading&4)" v-if="!isStatusKey(test, 'Deleted')" size="mini" type="danger" icon="el-icon-document-delete"  @click="bindModifyStatus(index, 'Deleted', test)">删除</el-button>
            <el-button :loading="!!(test.loading&8)" size="mini" icon="el-icon-document-copy" @click="bindCopy(index, test)">复制</el-button>
            <el-button size="mini" icon="el-icon-edit-outline" @click="bindEdit(index, test)">编辑</el-button>
          </template>
        </power-area>
      </el-card>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="bindSizeChange"
        @current-change="bindCurrentChange"
        layout="total,sizes,prev,pager,next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[3,6,9]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { getTestPage, modifyTestStatus, copyTestDetail } from '../../api/test'
  import { TestStatus } from '@/utils/enum'
  import { formatDateTime } from '@/utils/common'
  import PowerArea from '../../components/Power/area.vue'

  const defaultListQuery = {
    keyword: '',
    create_time: null,
    type: '',
    status: '',
    pageNum: 1,
    pageSize: 3
  }

  export default {
    name: 'testList',
    components: { PowerArea },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: [],
        total: 0,
        listLoading: false,
        rowLoading: -1,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        testStatusOptions: TestStatus.items()
      }
    },
    created() {
      this.getList()
    },
    filters: {
      formatTime(time) {
        return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
      },
      formatStatus(status) {
        return TestStatus.getName(status)
      }
    },
    methods: {
      isStatusKey(row, ...keys) {
        return keys.map(key => TestStatus[key].value).includes(row.status)
      },
      getList(paged) {
        if(!paged) this.listQuery.pageNum = 1
        this.listLoading = true
        getTestPage(this.listQuery).then(res => {
          const { list, total } = res.data
          list.forEach(item => item.loading = 0)
          this.list = list
          this.total = total
        }).catch(() => {}).then(() => this.listLoading = false)
      },
      bindSearchList() {
        this.getList()
      },
      bindResetSearch() {
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
      bindEdit(index, row) {
        this.$router.push({path:'/test/detail', query:{id:row.id}})
      },
      bindCopy(index, row) {
        row.loading |= 8
        copyTestDetail(row.id).then(res => {
          row.loading &= ~8
          this.getList()
        })
      },
      bindModifyStatus(index, status, row) {
        switch(status) {
          case 'Published': 
            this.modifyStatus(index, row.id, TestStatus[status].value); break
          case 'Paused': 
            this.$confirm('状态设为“暂停”后将不能填写，是否继续？', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, TestStatus[status].value)
            }).catch(() => {}); break
          case 'Deleted': 
            this.$confirm('您确认要删除此试卷吗？该操作无法回复！', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, TestStatus[status].value)
            }).catch(() => {}); break
        }
      },
      modifyStatus(index, tid, status) {
        this.rowLoading = index
        return modifyTestStatus(tid, status).then(res => {
          if(res.data) {
            this.getList()
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        }).catch(() => {}).then(() =>  this.rowLoading = -1)
      },
      bindReleaseCommand(command, row) {
        switch(command) {
          case 'link': 
            this.$router.push({path:'/test/link', query:{id:row.id}}); break
        }
      },
      bindResultCommand(command, row) {
        switch(command) {
          case 'result': 
            this.$router.push({path:'/test/result', query:{id:row.id}}); break
          case 'rank': 
            this.$router.push({path:'/test/ranking', query:{id:row.id}}); break
        }
      }
    }
  }
</script>
<style lang="scss">
  .table-container {
    .row {
      margin-bottom: 10px;
      .test-info {
        font-size: 12px;
        font-weight: normal;
        float: right;
        .test-answer {
          color: #409EFF;
        }
        .test-status0 {
          color: #409EFF;
        }
        .test-status1 {
          font-weight: bold;
          color: #67C23A;
        }
        .test-status2 {
          color: #409EFF;
        }
        .test-status3 {
          color: #F56C6C;
        }
      }
      .test-oper {
        float: right;
      }
    }
    :last-child {
      margin-bottom: 0;
    }
  }
</style>
