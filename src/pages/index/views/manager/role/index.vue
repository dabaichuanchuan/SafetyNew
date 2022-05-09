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
            <el-input v-model="listQuery.keyword" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="table-container" shadow="hover">
      <div class="icon-area">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
      </div>
      <div class="button-area">
        <el-button
          @click="bindCreate()"
          icon="el-icon-document-add"
          size="mini">
          添加
        </el-button>
      </div>
      <div class="table-area">
        <el-table ref="busTable"
                  :data="list"
                  size="small"
                  v-loading="listLoading" border>
          <el-table-column label="App ID" align="center" width="160">
            <template slot-scope="scope">{{scope.row.app_id}}</template>
          </el-table-column>
          <el-table-column label="企业名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="160">
            <template slot-scope="scope">{{scope.row.created|formatTime}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">
              <span :class="`bus-status${scope.row.status}`">{{scope.row.status|formatStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <div>
                <el-button :loading="scope.$index==rowLoading" size="mini" type="text" @click="bindManageUser(scope.$index, scope.row)">用户</el-button>
                <el-button size="mini" type="text" @click="bindEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button :loading="scope.$index==rowLoading" v-if="isStatusKey(scope.row, 'Normal')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Locked', scope.row)">锁定</el-button>
                <el-button :loading="scope.$index==rowLoading" v-else-if="isStatusKey(scope.row, 'Locked')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Normal', scope.row)">恢复</el-button>
                <el-button :loading="scope.$index==rowLoading" :disabled="!!scope.row.system" v-if="!isStatusKey(scope.row, 'Deleted')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Deleted', scope.row)">删除</el-button>
              </div>
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
      :title="dialogData.edit?'编辑企业':'添加企业'"
      :visible.sync="dialogData.show"
      width="960px">
      <el-form 
        :model="dialogData.model"
        ref="busForm"
        class="bus-form"
        :rules="dialogData.rules"
        label-width="105px" size="small">
        <el-row class="row">
          <el-col :span="11">
            <el-form-item label="企业名称：" prop="name">
              <el-input v-model="dialogData.model.name" :maxlength="100" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="试卷限制：" prop="settings.test_limit">
              <el-input-number
                v-model="dialogData.model.settings.test_limit"
                controls-position="right" :min="0" :max="9999999">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="答案限制：" prop="settings.paper_limit">
              <el-input-number 
                v-model="dialogData.model.settings.paper_limit"
                controls-position="right" :min="0" :max="9999999">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接口地址：" prop="settings.api_url">
              <el-input v-model="dialogData.model.settings.api_url" :maxlength="64" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="App ID：" prop="app_id">
              <el-input v-model="dialogData.model.app_id" :maxlength="64" show-word-limit>
                <el-button slot="append" icon="el-icon-refresh" @click.stop="generateKey('app_id')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="App Key：" prop="settings.app_key">
              <el-input v-model="dialogData.model.settings.app_key" :maxlength="64" show-word-limit>
                <el-button slot="append" icon="el-icon-refresh" @click.stop="generateKey('app_key')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ase Key：" prop="settings.ase_key">
              <el-input v-model="dialogData.model.settings.ase_key" :maxlength="32" :minlength="32" show-word-limit>
                <el-button slot="append" icon="el-icon-refresh" @click.stop="generateKey('ase_key')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogData.show=false" size="small">取 消</el-button>
        <el-button type="primary" @click="bindDialogConfirm()" :loading="dialogData.saving" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { modifyBusStatus, getBusPage, getBusGuid, saveBusDetail } from '../../../api/bus'
  import { BusStatus } from '@/utils/enum'
  import { formatDateTime } from '@/utils/common'
  import test from '@/utils/test'

  const defaultListQuery = {
    keyword: '',
    status: '',
    pageNum: 1,
    pageSize: 5
  }

  const defaultBusModel = {
    id: '',
    name: '',
    app_id: '',
    settings: {
      api_url: '',
      app_key: '',
      ase_key: '',
      test_limit: 100,
      paper_limit: 1000
    }
  }

  export default {
    name: 'busList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: [],
        total: 0,
        listLoading: false,
        rowLoading: -1,
        statusOptions: BusStatus.items(),
        dialogData: {
          show: false,
          saving: false,
          edit: false,
          model: Object.assign({}, defaultBusModel),
          modified: false,
          rules: {
            name: [
              { required: true, message: '请输入企业名称' }
            ],
            'app_id': [
              { required: true, message: '请输入应用标识' }
            ],
            'settings.app_key': [
              { required: true, message: '请输入应用密钥' },
              { min: 32, max: 32, message: '密钥长度必须为32位' },
              { validator: (rule, value, fun) => test.enOrNum(value) ? fun() : fun(new Error('密钥只能为字母或数字')) }
            ],
            'settings.api_url': [
              { required: true, message: '请输入接口地址' },
              { validator: (rule, value, fun) => test.enOrNum(value) ? fun() : fun(new Error('接口地址只能为字母或数字')) }
            ],
            'settings.ase_key': [
              { required: true, message: '请输入加密密钥' },
              { min: 32, max: 32, message: '密钥长度必须为32位' },
              { validator: (rule, value, fun) => test.enOrNum(value) ? fun() : fun(new Error('密钥只能为字母或数字')) }
            ],
          },
        }
      }
    },
    created() {
      this.getList()
    },
    filters: {
      formatTime(time) {
        return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
      },
      formatStatusName(status) {
        return BusStatus.getName(status)
      }
    },
    watch: {
      'dialogData.model': {
        handler: function(value) {
          this.dialogData.modified = this.dialogData.model.id
        },
        deep: true
      }
    },
    methods: {
      isStatusKey(row, key) {
        return row.status == BusStatus[key].value
      },
      getList(paged) {
        if(!paged) this.listQuery.pageNum = 1
        this.listLoading = true
        getBusPage(this.listQuery).then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
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
      bindModifyStatus(index, status, row) {
        switch(status) {
          case 'Normal': 
            this.modifyStatus(index, row.id, BusStatus[status].value); break
          case 'Locked': 
            this.$confirm('将状态设为“锁定”，该企业所有数据将暂停，是否继续？', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, BusStatus[status].value)
            }).catch(() => {}); break
          case 'Deleted': 
            this.$confirm('如“删除”该企业，相关数据都将删除，是否继续？', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, BusStatus[status].value)
            }).catch(() => {}); break
        }
      },
      modifyStatus(index, bid, status) {
        this.rowLoading = index
        return modifyBusStatus(bid, status).then(res => {
          if(res.data) {
            this.getList()
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        }).catch(() => {}).then(() =>  this.rowLoading = -1)
      },
      bindEdit(index, row) {
        this.dialogData.edit = true
        this.dialogData.model = Object.assign({}, row)
        this.dialogData.show = true
        this.$nextTick(() => {
          this.$refs.busForm.clearValidate()
          this.dialogData.modified = false
        })
      },
      bindCreate() {
        this.dialogData.edit = false
        this.dialogData.model = Object.assign({}, defaultBusModel)
        this.dialogData.show = true
        this.$nextTick(() => this.$refs.busForm.clearValidate())
      },
      resetForm() {
        this.dialogData.model = Object.assign({}, defaultBusModel)
        this.$refs.busForm.clearValidate()
      },
      generateKey(key) {
        getBusGuid(key).then(res => {
          const value = res
          if('app_id' == key) {
            this.dialogData.model.app_id = value
          } else {
            this.$set(this.dialogData.model.settings, key, value)
          }
        })
      },
      bindDialogConfirm() {
        this.$refs.busForm.validate(valid => {
          if (valid) {
            const exec = () => {
              this.dialogData.saving = true;
              saveBusDetail(this.dialogData.model)
              .then(res => {
                this.$message.success('保存成功')
                this.getList()
              }).catch(() => {}).then(() => {
                this.resetForm()
                this.dialogData.show = false
                this.dialogData.saving = false
              })
            }
            if(this.dialogData.edit) {
              if(this.dialogData.modified) {
                this.$confirm('修改企业数据将可能会数据接口，是否保存？', '提示', { type: 'warning' })
                .then(exec).catch(() => {})
              } else {
                this.dialogData.show = false
              } 
            }
            else {
              exec()
            }
          } else {
            this.$message.error('验证失败')
          }
        })
      },
      bindManageUser(index, row) {
        this.$router.push({path:'/manager/user', query:{bid:row.id}})
      }
    }
  }
</script>
<style lang="scss">
  .bus-form {
    padding: 0 15px;
  }
  .bus-status0 {
    color: #409EFF;
  }
  .bus-status1 {
    color: #606266;
  }
  .bus-status2 {
    color: #F56C6C;
  }
</style>
