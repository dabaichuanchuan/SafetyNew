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
              placeholder="请输入关键字"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select
              v-model="listQuery.type"
              class="input-width"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in menuTypOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示：">
            <el-select v-model="listQuery.flag" class="input-width" clearable>
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
          <el-table-column label="标题">
            <template slot-scope="scope">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">{{ scope.row.description }}</template>
          </el-table-column>
          <el-table-column label="Icon">
            <template slot-scope="scope">{{ scope.row.icon }}</template>
          </el-table-column>
          <el-table-column label="Name">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="路径">
            <template slot-scope="scope">{{ scope.row.path }}</template>
          </el-table-column>
          <el-table-column label="重定向" width="250px">
            <template slot-scope="scope">{{ scope.row.redirect }}</template>
          </el-table-column>
          <el-table-column label="父级" align="center">
            <template slot-scope="scope" v-if="scope.row.parentId !== 0">{{
              scope.row.parentId
            }}</template>
          </el-table-column>
          <el-table-column label="排序" align="center">
            <template slot-scope="scope" v-if="scope.row.orderNo !== 0">{{
              scope.row.orderNo
            }}</template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope" v-if="scope.row.type !== 0">{{
              scope.row.type | formatMenuTypeEnumName
            }}</template>
          </el-table-column>
          <el-table-column label="是否显示" align="center">
            <template slot-scope="scope" v-if="scope.row.parentId !== 0">{{
              scope.row.flagText
            }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.id != '1'"
                  @click="bindEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
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
          :page-sizes="[5, 10, 15]"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :title="dialogData.edit ? '编辑菜单' : '添加菜单'"
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
        <el-row class="row">
          <el-col :span="12">
            <el-form-item label="标题：" prop="title">
              <el-input
                v-model="dialogData.model.title"
                :maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name：" prop="name">
              <el-input
                v-model="dialogData.model.name"
                :maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <el-form-item label="描述：" prop="description">
              <el-input
                v-model="dialogData.model.description"
                :maxlength="255"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路径：" prop="path">
              <el-input
                v-model="dialogData.model.path"
                :maxlength="225"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重定向：" prop="redirect">
              <el-input
                v-model="dialogData.model.redirect"
                :maxlength="225"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Icon：" prop="icon">
              <el-input
                v-model="dialogData.model.icon"
                :maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级：" prop="parentId">
              <el-select
                v-model="dialogData.model.parentId"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in parentMenuList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <!-- <el-cascader v-model="dialogData.model.parentId" :options="loadTree" :props="defaultProps" check-strictly />  -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="序号：" prop="orderNo">
              <el-input-number
                v-model="dialogData.model.orderNo"
                controls-position="right"
                :min="1"
                :max="9999999"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <el-select
                v-model="dialogData.model.type"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in menuTypOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否显示：" prop="flag">
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
import {
  getMenuPage,
  getMenuParentList,
  saveMenu,
  loadTree,
} from "../../../api/menu";
import { CommonFlagEnum, MenuTypeEnum } from "@/utils/enum";
import { formatDateTime } from "@/utils/common";

const defaultListQuery = {
  keyWord: "",
  flag: "",
  type: "",
  pageNum: 1,
  pageSize: 10,
};

const defaultMenuModel = {
  id: 0,
  title: "",
  description: "",
  name: "",
  path: "",
  redirect: "",
  parentId: "",
  orderNo: 0,
  type: "",
  icon: "",
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
      menuTypOptions: MenuTypeEnum.items(),
      // loadTree: [],
      // defaultProps: {
      //   value: "id",
      //   label: "title",
      //   children: "children"
      // },
      parentMenuList: [],
      dialogData: {
        show: false,
        saving: false,
        edit: false,
        model: Object.assign({}, defaultMenuModel),
        //modified: false,
        rules: {
          title: [{ required: true, message: "请输入名称" }],
          name: [{ required: true, message: "请输入Name" }],
          path: [{ required: true, message: "请输入路径" }],
          parentId: [{ required: true, message: "请选择父级" }],
          orderNo: [{ required: true, message: "请输入序号" }],
          type: [{ required: true, message: "请选择类型" }],
        },
      },
    };
  },
  created() {
    this.bingParentMenuList();
    this.getList();
    //this.getTree();
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), "yyyy-MM-dd hh:mm:ss") : "";
    },
    formatMenuTypeEnumName(type) {
      return MenuTypeEnum.getName(type);
    },
  },
  watch: {
    // "dialogData.model": {
    //   handler: function (value) {
    //     this.dialogData.modified = this.dialogData.model.id;
    //   },
    //   deep: true,
    // },
  },
  methods: {
    getList(paged) {
      if (!paged) this.listQuery.pageNum = 1;
      this.listLoading = true;
      getMenuPage(this.listQuery).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    // getTree() {
    //   loadTree().then((res) => {
    //     this.loadTree = res.data;
    //   });
    // },
    bingParentMenuList() {
      getMenuParentList().then((res) => {
        this.parentMenuList = res.data;
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
    bindEdit(index, row) {
      this.dialogData.edit = true;
      this.dialogData.model = Object.assign({}, row);
      this.dialogData.show = true;
      this.$nextTick(() => {
        this.$refs.defaultForm.clearValidate();
        this.dialogData.modified = false;
      });
    },
    bindCreate() {
      this.dialogData.edit = false;
      this.dialogData.model = Object.assign({}, defaultMenuModel);
      this.dialogData.show = true;
      this.$nextTick(() => this.$refs.defaultForm.clearValidate());
    },
    resetForm() {
      this.dialogData.model = Object.assign({}, defaultMenuModel);
      this.$refs.defaultForm.clearValidate();
    },
    bindDialogConfirm() {
      this.$refs.defaultForm.validate((valid) => {
        if (valid) {
          this.dialogData.saving = true;
          saveMenu(this.dialogData.model)
            .then((res) => {
              this.$message.success("保存成功");
              this.bingParentMenuList();
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
    bindManageUser(index, row) {
      this.$router.push({ path: "/manager/user", query: { bid: row.id } });
    },
  },
};
</script>
<style lang="scss">
.default-form {
  padding: 0 15px;
}
.bus-status0 {
  color: #409eff;
}
.bus-status1 {
  color: #606266;
}
.bus-status2 {
  color: #f56c6c;
}
</style>
