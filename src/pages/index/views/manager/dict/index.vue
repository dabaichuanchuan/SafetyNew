<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="6">
        <el-card class="table-container" shadow="hover">
          <div class="icon-area">
            <i class="el-icon-tickets"></i>
            <span>字典类型</span>
          </div>
          <div class="table-area">
            <el-input
              v-model="filterText"
              placeholder="输⼊关键字进⾏搜索"
              prefix-icon="el-icon-search"
              size="small"
              clearable
            />
            <el-tree
              ref="refTree"
              :data="data"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              accordion
              style="margin-top: 10px"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <el-button
                    size="mini"
                    type="text"
                    @click="bindSearchList(data.id)"
                    >{{ node.label }}</el-button
                  >
                  <span>
                    <template>
                      <el-button
                        size="mini"
                        type="text"
                        @click="bindCreate(data)"
                        >添加类型</el-button
                      >
                    </template>
                    <template>
                      <el-button
                        size="mini"
                        type="text"
                        @click="bindCreateData(data)"
                        >添加数据</el-button
                      >
                    </template>
                    <template v-if="node.level !== 1">
                      <el-divider direction="vertical" />
                      <el-button size="mini" type="text" @click="bindEdit(data)"
                        >编辑类型</el-button
                      >
                    </template>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="table-container" shadow="hover">
          <div class="icon-area">
            <i class="el-icon-tickets"></i>
            <span>字典数据列表</span>
          </div>
          <div class="table-area">
            <el-table
              ref="busTable"
              :data="list"
              size="small"
              v-loading="listLoading"
              border
            >
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column label="值" align="center">
                <template slot-scope="scope">{{ scope.row.value }}</template>
              </el-table-column>
              <el-table-column label="序号" align="center">
                <template slot-scope="scope">{{ scope.row.orderNo }}</template>
              </el-table-column>
              <el-table-column label="描述" align="center">
                <template slot-scope="scope">{{ scope.row.description }}</template>
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
                    @click="bindEditData(scope.row)"
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
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogData.edit ? '编辑字典类型' : '添加字典类型'"
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
            <el-form-item label="企业：" prop="tenantId">
              <el-select
                v-model="dialogData.model.tenantId"
                placeholder="请选择" disabled 
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
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述：" prop="description">
              <el-input
                v-model="dialogData.model.description"
                :maxlength="225"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
    <el-dialog
      :title="dialogData1.edit ? '编辑字典数据' : '添加字典数据'"
      :visible.sync="dialogData1.show"
      width="50%"
    >
      <el-form
        :model="dialogData1.model"
        ref="defaultDataForm"
        class="default-data-form"
        :rules="dialogData1.rules"
        label-width="105px"
        size="small"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input
                v-model="dialogData1.model.name"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值：" prop="value">
              <el-input
                v-model="dialogData1.model.value"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号：" prop="seq">
              <el-input
                v-model="dialogData1.model.seq"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="属性1：" prop="property1">
              <el-input
                v-model="dialogData1.model.property1"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性2：" prop="property2">
              <el-input
                v-model="dialogData1.model.property2"
                :maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述：" prop="description">
              <el-input
                v-model="dialogData1.model.description"
                :maxlength="225"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogData1.show = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="bindDialogConfirmData()"
          :loading="dialogData1.saving"
          size="small"
          >确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictTypeListForEnterprise,
  getDictDataPage,
  saveDictType,
  saveDictData,
} from "../../../api/dict";
import { getEnterpriseList } from "../../../api/enterprise";
import { CommonFlagEnum } from "@/utils/enum";
import { formatDateTime } from "@/utils/common";

const defaultListQuery = {
  keyWord: "",
  dicttypeId: "",
  tenantId: '',
  flag: "",
  pageNum: 1,
  pageSize: 10,
};

const defaultModel = {
  id: "",
  name: "",
  parentId: "",
  orderNo: "",
  description: "",
  tenantId: "",
  flag: 0,
};

const defaultDataModel = {
  id: "",
  name: "",
  dicttypeId: "",
  value: "",
  description: "",
  property1: "",
  property2: "",
  orderNo: "",
  flag: 0,
};

export default {
  name: "defaultList",
  data() {
    return {
      filterText: "",
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      listLoading: false,
      rowLoading: -1,
      filterText: "",
      enterpriseOptions: [],
      flagOptions: CommonFlagEnum.items(),
      data: [{}],
      defaultProps: {
        id: "id", //标识每个结点
        label: "name", //结点的⽂本展⽰
        children: "children", //结点的⼦节点
      },
      list: [],
      listLoading: false,
      dialogData: {
        show: false,
        saving: false,
        edit: false,
        model: Object.assign({}, defaultModel),
        rules: {
          name: [{ required: true, message: "请输入名称" }],
          orderNo: [{ required: true, message: "请输入序号" }],
          flag: [{ required: true, message: "请输选择启用状态" }],
        },
      },
      dialogData1: {
        show: false,
        saving: false,
        edit: false,
        model: Object.assign({}, defaultDataModel),
        rules: {
          name: [{ required: true, message: "请输入名称" }],
          orderNo: [{ required: true, message: "请输入序号" }],
          flag: [{ required: true, message: "请输选择启用状态" }],
        },
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.refTree.filter(val.trim());
    },
  },
  computed: {},
  created() {
    this.load_data();
    this.getEnterpriseOptions();
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), "yyyy-MM-dd hh:mm:ss") : "";
    },
  },
  methods: {
    getEnterpriseOptions() {
      const query = {};
      getEnterpriseList(query).then((res) => {
        this.enterpriseOptions = res.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    load_data() {
      this.listLoading = true;
      const _this = this;
      // 通过axios发起请求，后端如果有登录验证注解，就加上headers信息
      getDictTypeListForEnterprise().then((res) => {
        _this.data = res.data;
        this.listLoading = false;
      });
    },
    getList(paged) {
      if (!paged) this.listQuery.pageNum = 1;
      this.listLoading = true;
      getDictDataPage(this.listQuery).then((res) => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    bindSearchList(id) {
      defaultListQuery.dicttypeid = id;
      this.listQuery = Object.assign(this.listQuery, defaultListQuery);
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
    bindCreate(row) {
      this.dialogData.edit = false;
      defaultModel.tenantId = row.id;
      defaultModel.parentId = row.id;
      this.dialogData.model = Object.assign({}, defaultModel);
      this.dialogData.show = true;
      this.$nextTick(() => this.$refs.defaultForm.clearValidate());
    },
    bindEdit(row) {
      this.dialogData.edit = true;
      this.dialogData.model = Object.assign({}, row);
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
          saveDictType(this.dialogData.model)
            .then((res) => {
              this.$message.success("保存成功");
              this.load_data();
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

    bindCreateData(row) {
      this.dialogData1.edit = false;
      defaultDataModel.dicttypeid = row.id;
      this.dialogData1.model = Object.assign({}, defaultDataModel);
      this.dialogData1.show = true;
      this.$nextTick(() => this.$refs.defaultDataForm.clearValidate());
    },
    bindEditData(row) {
      this.dialogData1.edit = true;
      this.dialogData1.model = Object.assign({}, row);
      this.dialogData1.show = true;
      this.$nextTick(() => this.$refs.defaultDataForm.clearValidate());
    },
    resetFormData() {
      this.dialogData1.model = Object.assign({}, defaultDataModel);
      this.$refs.defaultDataForm.clearValidate();
    },
    bindDialogConfirmData() {
      this.$refs.defaultDataForm.validate((valid) => {
        if (valid) {
          saveDictData(this.dialogData1.model)
            .then((res) => {
              this.$message.success("保存成功");
              this.getList();
            })
            .catch(() => {})
            .then(() => {
              this.resetFormData();
              this.dialogData1.show = false;
              this.dialogData1.saving = false;
            });
        } else {
          this.$message.error("验证失败");
        }
      });
    },
  },
};
</script> 
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>