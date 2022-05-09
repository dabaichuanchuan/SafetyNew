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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
          <el-form-item label="业态：">
            <el-select v-model="listQuery.businesstype" class="input-width" clearable placeholder="请选择">
              <el-option
                v-for="item in businesstypeOptions"
                :key="item.businessType"
                :label="item.businessName"
                :value="item.businessType">
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
          <el-table-column label="岗位ID" align="center">
            <template slot-scope="scope">{{scope.row.positionID}}</template>
          </el-table-column>
          <el-table-column label="岗位名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="描述" align="center" width="210">
            <template slot-scope="scope">{{scope.row.description}}</template>
          </el-table-column>          
          <el-table-column label="时间" align="center" width="210">
            <template slot-scope="scope">{{scope.row.createdTime|formatTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
             <template slot-scope="scope"> <el-button size="mini" type="text" @click="bindEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <div v-if="0>scope.row.roles">不支持</div>
              <div v-else>
                <el-button size="mini" type="text" @click="bindEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button :loading="scope.$index==rowLoading" v-if="isStatusKey(scope.row, 'Normal')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Locked', scope.row)">锁定</el-button>
                <el-button :loading="scope.$index==rowLoading" v-else-if="isStatusKey(scope.row, 'Locked')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Normal', scope.row)">恢复</el-button>
                <el-button :loading="scope.$index==rowLoading" :disabled="!!scope.row.system" v-if="!isStatusKey(scope.row, 'Deleted')" size="mini" type="text" @click="bindModifyStatus(scope.$index, 'Deleted', scope.row)">删除</el-button>
               </div> -->
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
      :title="dialogData.edit?'编辑岗位':'添加岗位'"
      :visible.sync="dialogData.show"
      width="50%">
      <el-form 
        :model="dialogData.model"
        ref="positionForm"
        class="position-form"
        :rules="dialogData.rules"
        label-width="105px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位名称：" prop="name">
              <el-input 
                v-model="dialogData.model.name" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属企业：" prop="tenantID">
              <el-input 
                v-model="dialogData.model.tenantID" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="所属业态：" prop="businesstype">
               <el-select v-model="dialogData.model.businesstype" placeholder="请选择">
              <el-option
                v-for="item in businesstypeOptions"
                :key="item.businessType"
                :label="item.businessName"
                :value="item.businessType" show-word-limit>
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：" prop="postOrder">
              <el-input 
                v-model="dialogData.model.postOrder" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>        
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构类型：" prop="grade">
              <el-input 
                v-model="dialogData.model.grade" 
                :maxlength="64" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
           <el-form-item label="描述：" prop="description">
              <el-input 
                v-model="dialogData.model.description" 
                :maxlength="64" show-word-limit>
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
  import { savePositionDetail,getPositionPage } from '../../../api/position'
  import { getBusinesstypeList } from '../../../api/businesstype'
  import { UserStatus, UserRoles, flagsToItems, itemsToFlags } from '@/utils/enum'
  import { formatDateTime } from '@/utils/common'

  const defaultListQuery = {
    positionID: '',
    keyword: '',
    //spans: null,
    //roles: '',
    businesstype: '',
    pageNum: 1,
    pageSize: 5
  }

  const defaultPositionModel = {
    positionID: '',
    name: '',
    description: '',
    tenantID: '',
    grade: '',
    postOrder: '',
    businesstype: '',
  }

  export default {
    name: 'positionList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: [],
        total: 0,
        listLoading: false,
        rowLoading: -1,
        businesstypeOptions:  [],
        //rolesOptions: UserRoles.items(),
        dialogData: {
          show: false,
          saving: false,
          edit: false,
          model: Object.assign({}, defaultPositionModel),
          //rolesOptions: UserRoles.items(),
          rules: {
            // account: [
            //   { required: true, message: '请输入账号' },
            //   { validator: (role, value, callback) => {
            //       if(!value) {
            //         callback()
            //       } else {
            //         accountExists({ name: value, id: this.dialogData.model.id }).then(res => {
            //           return res.data ? callback(new Error('该用户名已存在')) : callback()
            //         })
            //       }
            //     } 
            //   }
            // ],
            name: [
              { required: true, message: '请输入岗位名称' }
            ],
            tenantID: [
              { required: true, message: '请选择所属企业' }
            ],
            businessType: [
              { required: true, message: '请选择所属业态',  trigger: ['change','blur']  }
            ],
            postOrder: [
              { required: true, message: '请输入排序号' }
            ],
            grade: [
              { required: true, message: '请选择机构类型' }
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
      searchBusinesstypeValue: {
        get: function() {
          return flagsToItems(this.listQuery.businesstype)
        },
        set: function(nval) {
          this.listQuery.businesstype = itemsToFlags(nval, '')
        }
      },
      selectBusinesstypeValue: {
        get: function() {
          return flagsToItems(this.dialogData.model.roles)
        },
        set: function(nval) {
          this.dialogData.model.roles = itemsToFlags(nval, '')
        }
      }
    },
    created() {
      if(this.$route.query.positionID) {
        defaultListQuery.positionID = defaultPositionModel.positionID = this.listQuery.positionID = this.$route.query.positionID
      }
      this.getBusinesstypeOptions()
      this.getList()
    },
    filters: {
      formatTime(time) {
        return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
      },
      // formatStatusName(status) {
      //   return UserStatus.getName(status)
      // },
      // formatRoles(roles) {
      //   return 0 > roles ? '系统管理员' : UserRoles.getNames(roles, '未配置')
      // }
    },
    methods: {
      // isStatusKey(row, key) {
      //   return row.status == UserStatus[key].value
      // },
      getBusinesstypeOptions(){
        getBusinesstypeList().then((res) => {
          this.businesstypeOptions = res.data
        })
      },
      getList(paged) {
        if(!paged) this.listQuery.pageNum = 1
        this.listLoading = true
        getPositionPage(this.listQuery).then(res => {
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
            this.modifyStatus(index, row.id, UserStatus[status].value); break
          case 'Locked': 
            this.$confirm('将状态设为“锁定”，该用户将无法登录，是否继续？', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, UserStatus[status].value)
            }).catch(() => {}); break
          case 'Deleted': 
            this.$confirm('如“删除”该用户，相关数据都将删除，是否继续？', '提示', { type: 'warning' })
            .then(() => {
              this.modifyStatus(index, row.id, UserStatus[status].value)
            }).catch(() => {}); break
        }
      },
      modifyStatus(index, uid, status) {
        this.rowLoading = index
        return modifyUserStatus(uid, status).then(res => {
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
        this.$nextTick(() => this.$refs.positionForm.clearValidate())        
      },
      bindCreate() {
        this.dialogData.edit = false
        this.dialogData.model = Object.assign({}, defaultPositionModel)
        this.dialogData.show = true
        this.$nextTick(() => this.$refs.positionForm.clearValidate())
      },
      resetForm() {
        this.dialogData.model = Object.assign({}, defaultPositionModel)
        this.$refs.positionForm.clearValidate()
      },
      bindDialogConfirm() {
        this.$refs.positionForm.validate(valid => {
          if (valid) {
            savePositionDetail(this.dialogData.model)
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
      }
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
