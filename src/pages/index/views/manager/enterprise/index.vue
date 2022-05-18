<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="hover">
      <div class="icon-area">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div class="button-area">
        <el-button type="primary" @click="bindSearchList()" size="small">
          搜索
        </el-button>
        <el-button @click="bindResetSearch()" size="small"> 重置 </el-button>
      </div>
      <div class="where-area">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="100px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.keyWord"
              class="input-width"
              placeholder="请输入关键字"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.flag"
              class="input-width"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in flagOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
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
          size="mini"
        >
          添加
        </el-button>
      </div>
      <div class="table-area">
        <el-table
          ref="defaultTable"
          :data="list"
          size="small"
          v-loading="listLoading"
          border
        >
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="拼音" align="center">
            <template slot-scope="scope">{{ scope.row.namePy }}</template>
          </el-table-column>
          <el-table-column label="编码" align="center">
            <template slot-scope="scope">{{ scope.row.code }}</template>
          </el-table-column>
          <el-table-column label="排序" align="center">
            <template slot-scope="scope">{{ scope.row.orderNo }}</template>
          </el-table-column>          
          <el-table-column label="是否启用" align="center">
            <template slot-scope="scope">{{ scope.row.flagText }}</template>
          </el-table-column>
          <el-table-column label="时间" align="center" width="210">
            <template slot-scope="scope">
              <div>创建时间：{{ scope.row.createrTime | formatTime }}</div>
              <div>更新时间：{{ scope.row.modifierTime | formatTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="bindEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
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
          :page-sizes="[5, 10, 15]"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="dialogData.edit ? '编辑企业' : '添加企业'"
      :visible.sync="dialogData.show"
      width="50%"
    >
      <el-form
        :model="dialogData.model"
        ref="defaultForm"
        class="default-form"
        :rules="dialogData.rules"
        label-width="105px"
        size="small"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input
                v-model="dialogData.model.name"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拼音：" prop="namePy">
              <el-input
                v-model="dialogData.model.namePy"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="编码：" prop="code">
              <el-input-number
                v-model="dialogData.model.code"
                :min="1"
                :max="9999999"
                show-word-limit
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序号：" prop="orderNo">
              <el-input-number
                v-model="dialogData.model.orderNo"
                :min="1"
                :max="9999999"
                show-word-limit
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        <el-button @click="dialogData.show = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="bindDialogConfirm()"
          :loading="dialogData.saving"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { saveEnterprise, getEnterprisePage } from "../../../api/enterprise";
import { CommonFlagEnum } from "@/utils/enum";
import { formatDateTime } from "@/utils/common";

const defaultListQuery = {
  keyWord: "",
  flag: "",
  pageNum: 1,
  pageSize: 5,
};

const defaultModel = {
  id: "",
  name: "",
  namePy: "",
  code: "",
  orderNo: "",
  flag: 0,
};

export default {
  name: "defaultList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      listLoading: false,
      rowLoading: -1,
      flagOptions: CommonFlagEnum.items(),
      dialogData: {
        show: false,
        saving: false,
        edit: false,
        model: Object.assign({}, defaultModel),
        rules: {
          name: [{ required: true, message: "请输入名称" }],
          code: [{ required: true, message: "请输入编码" }],
          orderNo: [{ required: true, message: "请输入序号" }],
        },
      },
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), "yyyy-MM-dd hh:mm:ss") : "";
    },
  },
  methods: {
    getList(paged) {
      if (!paged) this.listQuery.pageNum = 1;
      this.listLoading = true;
      getEnterprisePage(this.listQuery).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    bindSearchList() {
      this.getList();
    },
    bindResetSearch() {
      this.listQuery = Object.assign(this.listQuery, defaultListQuery);
    },
    bindSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    bindCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList(true);
    },
    modifyStatus(index, uid, status) {
      this.rowLoading = index;
      return modifyUserStatus(uid, status)
        .then((res) => {
          if (res.data) {
            this.getList();
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(() => {})
        .then(() => (this.rowLoading = -1));
    },
    bindEdit(index, row) {
      this.dialogData.edit = true;
      this.dialogData.model = Object.assign({}, row);
      this.dialogData.show = true;
      this.$nextTick(() => this.$refs.defaultForm.clearValidate());
    },
    bindCreate() {
      this.dialogData.edit = false;
      this.dialogData.model = Object.assign({}, defaultModel);
      this.dialogData.show = true;
      this.$nextTick(() => this.$refs.defaultForm.clearValidate());
    },
    resetForm() {
      this.dialogData.model = Object.assign({}, defaultModel);
      this.$refs.defaultForm.clearValidate();
    },
    bindDialogConfirm() {
      this.$refs.defaultForm.validate((valid) => {
        if (valid) {
          saveEnterprise(this.dialogData.model)
            .then((res) => {
              this.$message.success("保存成功");
              this.getList();
            })
            .catch(() => {})
            .then(() => {
              this.resetForm();
              this.dialogData.show = false;
              this.dialogData.saving = false;
            });
        } else {
          this.$message.error("验证失败");
        }
      });
    },
  },
};
</script>
<style lang="scss">
.user-form {
  padding: 0 15px;
}

.user-status0 {
  color: #409eff;
}

.user-status1 {
  color: #606266;
}

.user-status2 {
  color: #f56c6c;
}
</style>
