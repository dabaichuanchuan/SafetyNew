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
          <el-row>
            <el-form-item label="输入搜索：">
              <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-select v-model="listQuery.flag" class="input-width" clearable placeholder="请选择">
                <el-option
                  v-for="item in flagOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-date-picker
                v-model="listQuery.spans"
                class="input-width"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="企业：">
              <el-select 
                v-model="listQuery.tenantId" 
                show-word-limit
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in enterpriseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位：">
              <template>
                <el-autocomplete
                  v-model="listQuery.orgName"
                  :fetch-suggestions="querySearchOrgAsync"
                  value-key="name"
                  placeholder="请输入关键词"
                  :trigger-on-focus="false"
                  @select="searchSelectOrg"
                />
              </template>
            </el-form-item>
          </el-row>
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
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">{{scope.row.userName}}</template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">{{scope.row.orgName}}</template>
          </el-table-column>
          <el-table-column label="企业" align="center">
            <template slot-scope="scope">{{scope.row.tenantName}}</template>
          </el-table-column>
          <el-table-column label="岗位" align="center">
            <template slot-scope="scope">{{scope.row.positionName}}</template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="210">
            <template slot-scope="scope">{{scope.row.createrTime|formatTime}}</template>
          </el-table-column>
          <el-table-column label="是否启用" align="center" width="80">
            <template slot-scope="scope">
              <span :class="`user-status${scope.row.flag}`">{{scope.row.flag|formatFlagName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" type="text" @click="bindEdit(scope.$index, scope.row)">编辑</el-button>
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
      :title="dialogData.edit?'编辑用户':'添加用户'"
      :visible.sync="dialogData.show"
      width="50%">
      <el-form 
        :model="dialogData.model"
        ref="userForm"
        class="user-form"
        :rules="dialogData.rules"
        label-width="120px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名：" prop="name">
              <el-input 
                v-model="dialogData.model.name" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户名：" prop="userName">
              <el-input 
                v-model="dialogData.model.userName" 
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密码：" v-if="!dialogData.edit" prop="passWord">
              <el-input 
                v-model="dialogData.model.passWord" 
                type="password"
                placeholder="请输入密码"
                show-password
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="密码：" v-else prop="newPassWord">
              <el-input 
                v-model="dialogData.model.newPassWord" 
                type="password"
                placeholder="请输入新密码"
                show-password
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号：" prop="mobile">
              <el-input 
                v-model="dialogData.model.mobile" 
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮箱：" prop="email">
              <el-input 
                v-model="dialogData.model.email" 
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="RtxUserID：" prop="rtxUserId">
              <el-input 
                v-model="dialogData.model.rtxUserId" 
                :maxlength="50" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="岗位：" prop="positionName">
              <el-input 
                v-model="dialogData.model.positionName" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="单位：" prop="orgId">
              <template>
                <el-autocomplete
                  v-model="dialogData.model.orgName"
                  :fetch-suggestions="querySearchOrgAsync"
                  value-key="name"
                  placeholder="请输入关键词"
                  :trigger-on-focus="false"
                  @select="handleSelectOrg"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别：" prop="sex">
              <el-switch
                v-model="dialogData.model.sex"
                :active-value="1"
                :inactive-value="0"
                active-text="男"
                inactive-text="女"
                active-color="#70DB93"
                inactive-color="#FF6EC7"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="企业：" prop="tenantId">
              <el-select
                v-model="dialogData.model.tenantId" 
                show-word-limit
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in enterpriseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否启用：" prop="flag">
              <el-switch
                v-model="dialogData.model.flag"
                :active-value="0"
                :inactive-value="1"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
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
  import { getUserPage, saveUserDetail, userExists } from '../../../api/manager/user'
  import { getOrgSelectList } from "../../../api/manager/organization";
  import { getEnterpriseList } from '../../../api/manager/enterprise'
  import { CommonFlagEnum } from '@/utils/enum'
  import { formatDateTime } from '@/utils/common'

  const defaultListQuery = {
    keyWord: '',
    flag: '',
    spans: null,
    tenantId: '',
    orgId: '',
    orgName: '',
    pageNum: 1,
    pageSize: 5
  }

  const defaultUserModel = {
    id: '',
    name: '',
    userName: '',
    passWord: '',
    newPassWord: '',
    mobile: '',
    email: '',
    rtxUserId: '',
    sex: 1,
    orgId: '',
    orgName: '',
    tenantId: '',
    tenantName: '',
    piositionId: '',
    positionName: '',
    flag: 0,
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
        flagOptions: CommonFlagEnum.items(),
        enterpriseOptions: [],
        orgSelectList: [],
        searchOrgIdchange:false,
        orgIdchange:false,
        dialogData: {
          show: false,
          saving: false,
          edit: false,
          model: Object.assign({}, defaultUserModel),
          modified: false,
          rules: {
            name: [
              { required: true, message: '请输入姓名' }
            ],
            userName: [
              { required: true, message: '请输入用户名' },
              { validator: (rule, value, callback) => {
                  if(!value) {
                    callback()
                  } else {
                    userExists({ userName: value, id: this.dialogData.model.id }).then(res => {
                      return res.data ? callback(new Error('该用户名已存在')) : callback()
                    })
                  }
                } 
              }
            ],
            passWord: [
              { required: true, message: '请输入密码' }
            ],
            orgId: [
              { required: true, message: '请输入并选择单位' }
            ],
            tenantId: [
              { required: true, message: '请选择企业' }
            ]
          }
        },
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
        }
      }
    },
    computed: {
      
    },
    created() {
      this.getList()
      this.getEnterpriseOptions() 
    },
    watch: {
      'dialogData.model.orgId'(val) {
        this.orgIdchange = true;
      },
      'dialogData.model.orgName'(newval,oldval) {
        if(!this.orgIdchange && newval != oldval){
          this.dialogData.model.orgId=''
        }
        this.orgIdchange = false;
      },
      'listQuery.orgId'(val) {
        this.searchOrgIdchange = true;
      },
      'listQuery.orgName'(newval,oldval) {
        if(!this.searchOrgIdchange && newval != oldval){
          this.listQuery.orgId = ''
        }
        this.searchOrgIdchange = false;
      },
    },
    filters: {
      formatTime(time) {
        return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : '无记录'
      },
      formatFlagName(flag) {
        return CommonFlagEnum.getName(flag)
      }
    },
    methods: {   
      getEnterpriseOptions() {
        const query = {}
        getEnterpriseList(query).then(res => {
          this.enterpriseOptions = res.data
        })
      },
      getList(paged) {
        if(!paged) this.listQuery.pageNum = 1
        this.listLoading = true
        getUserPage(this.listQuery).then(res => {
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
      bindEdit(index, row) {
        this.dialogData.edit = true
        this.dialogData.model = Object.assign({}, row)
        this.dialogData.show = true
        this.$nextTick(() => this.$refs.userForm.clearValidate())
      },
      bindCreate() {
        this.dialogData.edit = false
        this.dialogData.model = Object.assign({}, defaultUserModel)
        this.dialogData.show = true
        this.$nextTick(() => this.$refs.userForm.clearValidate())
      },
      resetForm() {
        this.dialogData.model = Object.assign({}, defaultUserModel)
        this.$refs.userForm.clearValidate()
      },
      bindDialogConfirm() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            saveUserDetail(this.dialogData.model)
              .then(res => {
                this.$message.success('保存成功')
                this.getList()
              }).catch(() => {}).then(() => {
                this.resetForm()
                this.dialogData.show = false
                this.dialogData.saving = false
              })
          } else {
            this.$message.error('验证失败')
          }
        })
      },
      querySearchOrgAsync(queryString, cb) {
        if (queryString) {
          getOrgSelectList({ keyword: queryString.trim() }).then((res) => {
            this.orgSelectList = res.data;
          });
        }
        setTimeout(() => {
          cb(this.orgSelectList);
        }, 200);
      },
      handleSelectOrg(item) {
        this.dialogData.model.orgId = item.id;
        this.dialogData.model.orgName = item.name;
        console.log(item);
      },
      searchSelectOrg(item) {
        this.listQuery.orgId = item.id;
        this.listQuery.orgName = item.name;
      },
    }
  }
</script>
<style lang="scss">
  .user-form {
    padding: 0 15px;
  }
  .user-status0 {
    color: #409EFF;
  }
  .user-status1 {
    color: #606266;
  }
  .user-status2 {
    color: #F56C6C;
  }
</style>
