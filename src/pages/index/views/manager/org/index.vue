<template>
  <div class="app-container">
    <el-card class="orgs-bg">
      <div slot="header" class="clearfix">
        <span>单位管理</span>
        <el-form :inline="true" size="small" style="float: right">
          <el-form-item label="输入搜索：" style="margin: 0">
            <el-input
              v-model="keyword"
              class="input-width"
              prefix-icon="el-icon-search"
              placeholder="输入搜索"
              v-loading="searching"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-tree
          ref="lazyTree"
          node-key="id"
          :key="lazyTreeKey"
          v-show="!keyword || !keyword.trim()"
          :load="loadTree"
          lazy
          v-loading="loading"
          :show-checkbox="false"
          :expand-on-click-node="true"
          @node-click="bindNodeClick"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="nodeClass(node, data)"
              >{{ node.label
              }}<span class="node-type">{{
                data.orgType | formatNodeType
              }}</span></span
            >
            <span>
              <el-button
                size="mini"
                type="text"
                @click.stop="bindCreate(data, 'load')"
                >添加</el-button
              >
              <el-button
                v-if="data.parentId"
                size="mini"
                type="text"
                @click.stop="bindEdit(data, 'load')"
                >编辑</el-button
              >
              <el-button
                v-if="data.parentId"
                size="mini"
                type="text"
                @click.stop="orgDelete(data, 'load')"
                >删除</el-button
              >
              <el-button size="mini" type="text" @click.stop="showOrgData(data)"
                >查看</el-button
              >

              <!-- <slot name="menu" :node="node" :data="data"></slot> -->
            </span>
          </span>
        </el-tree>
        <el-tree
          ref="searchTree"
          node-key="id"
          v-show="keyword && keyword.trim()"
          :data="orgs"
          v-loading="loading"
          :show-checkbox="false"
          :expand-on-click-node="true"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="bindNodeClick"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="nodeClass(node, data)"
              >{{ node.label
              }}<span class="node-type">{{
                data.orgType | formatNodeType
              }}</span></span
            >
            <span>
              <el-button
                size="mini"
                type="text"
                @click.stop="bindCreate(data, 'search')"
                >添加</el-button
              >
              <el-button
                v-if="data.parentId"
                size="mini"
                type="text"
                @click.stop="bindEdit(data, 'search')"
                >编辑</el-button
              >
              <el-button
                v-if="data.parentId"
                size="mini"
                type="text"
                @click.stop="orgDelete(data, 'search')"
                >删除</el-button
              >
              <el-button size="mini" type="text" @click.stop="showOrgData(data)"
                >查看</el-button
              >
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <transition name="bounce">
      <el-card class="orgs-bg" v-if="dataModelShow">
        <div slot="header" class="button-area clearfix">
          <span>单位信息详情</span>
          <el-form :inline="true" size="small" style="float: right">
            <el-button @click="bindClear()" size="small"> 关闭 </el-button>
          </el-form>
        </div>
        <div>
          <el-form
            v-model="dataModel"
            v-if="dataModelShow"
            class="bus-form"
            label-width="150px"
            size="small"
          >
            <el-row class="row">
              <el-col :span="20">
                <el-form-item label="单位名称：" prop="name">
                  {{ dataModel.name }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="公司名称：" prop="companyName">
                  {{ dataModel.companyName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="拼音（全拼）：" prop="nameFullPy">
                  {{ dataModel.nameFullPy }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="拼音（简拼）：" prop="namePy">
                  {{ dataModel.namePy }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="父级单位：" prop="parentId">
                  {{ dataModel.parentName }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="实际父级单位：" prop="parentActualId">
                  {{ dataModel.parentActualName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="所在城市" prop="cityId">
                  {{ dataModel.cityName }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="GroupID：" prop="groupId">
                  {{ dataModel.groupId }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="机构类型：" prop="orgType">
                  {{
                    dataModel.orgType == 0
                      ? ""
                      : orgTypeEnumList.find(
                          (a) => a.value == dataModel.orgType
                        ).name
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="所属业态：" prop="businessType">
                  {{ dataModel.businessTypeName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="单位类型：" prop="isOrg">
                  {{
                    dataModel.isOrg == 0
                      ? ""
                      : isOrgEnumList.find((a) => a.value == dataModel.isOrg)
                          .name
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="开业时间：" prop="openTime">
                  {{ dataModel.openTime | dateFormat("yyyy-MM-dd") }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="是否启用：" prop="flag">
                  {{ dataModel.flag == 0 ? "已启用" : "未启用" }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="是否筹备期：" prop="isPreparation">
                  {{ dataModel.isPreparation == 1 ? "是" : "否" }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="创建时间：" prop="createrTime">
                  {{ dataModel.createrTime | dateFormat }}
                  {{ (dataModel.creater != null ? '('+ dataModel.creater +')' : '') }}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="修改时间：" prop="modifierTime">
                  {{ dataModel.modifierTime | dateFormat }}
                  {{ (dataModel.modifier != null ? '('+ dataModel.modifier +')' : '') }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </transition>
    <el-dialog
      :title="dialogData.edit ? '编辑单位' : '添加单位'"
      :visible.sync="dialogData.show"
      width="960px"
    >
      <el-form
        :model="dialogData.model"
        ref="orgForm"
        class="bus-form"
        :rules="dialogData.rules"
        label-width="120px"
        size="small"
      >
        <el-row class="row">
          <el-col :span="10">
            <el-form-item label="单位名称：" prop="name">
              <el-input
                v-model="dialogData.model.name"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="公司名称" prop="companyName">
              <el-input
                v-model="dialogData.model.companyName"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="拼音（全拼）：" prop="nameFullPy">
              <el-input
                v-model="dialogData.model.nameFullPy"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="拼音（简拼）：" prop="namePy">
              <el-input
                v-model="dialogData.model.namePy"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="父级单位：" prop="parentId">
              <el-input
                v-model="dialogData.model.parentName"
                disabled
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实际父级单位：" prop="parentActualId">
              <template>
                <el-autocomplete
                  v-model="dialogData.model.parentActualName"
                  :fetch-suggestions="querySearchOrgAsync"
                  value-key="name"
                  placeholder="请输入关键词"
                  :trigger-on-focus="false"
                  @select="handleSelectOrg"
                />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="所在城市" prop="cityId">
              <template>
                <el-autocomplete
                  v-model="dialogData.model.cityName"
                  :fetch-suggestions="querySearchCityAsync"
                  value-key="name"
                  placeholder="请输入关键词"
                  :trigger-on-focus="false"
                  @select="handleSelectCity"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="GroupID：" prop="groupId">
              <el-input
                v-model="dialogData.model.groupId"
                :maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="机构类型：" prop="orgType">
              <el-select
                v-model="dialogData.model.orgType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in orgTypeEnumList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属业态：" prop="businessId">
              <el-select
                v-model="dialogData.model.businessId"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in businessList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="单位类型：" prop="isOrg">
              <el-select
                v-model="dialogData.model.isOrg"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in isOrgEnumList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="是否筹备期：" prop="isPreparation">
              <el-switch
                v-model="dialogData.model.isPreparation"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="开业时间：" prop="openTime">
              <el-date-picker
                v-model="dialogData.model.openTime"
                :editable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开业时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
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
  getOrgTreeList,
  searchOrgTreeList,
  saveOrg,
  orgDelete,
  getOrgSelectList,
  getCitySelectList,
} from "../../../api/manager/organization";
import { getBusinessList } from "../../../api/manager/business";
import { OrgTypeEnum, IsOrgEnum } from "@/utils/enum";
import { formatDateTime } from "@/utils/common";

const maxSearchCount = 10;

const defaultOrgModel = {
  id: "",
  parentId: "",
  parentName: "",
  parentActualId: "",
  parentActualName: "",
  groupId: "",
  parentGroupId: "",
  orderId: 0,
  groupOrder: 0,
  path: "",
  actualPath: "",
  name: "",
  nameFullPy: "",
  namePy: "",
  cityId: "",
  cityName: "",
  orgType: "",
  businessId: "",
  isOrg: "",
  companyName: "",
  openTime: "",
  isPreparation: 0,
  flag: 0,
};

export default {
  name: "orgList",
  data() {
    return {
      loading: false,
      searching: false,
      keyword: "",
      orgTypeEnumList: OrgTypeEnum.items(),
      isOrgEnumList: IsOrgEnum.items(),
      businessList: [],
      orgs: [],
      id: "",
      lazyTreeKey: 1,
      citySelectList: [],
      orgSelectList: [],
      dataModel: {},
      dataModelShow: false,
      defaultProps: {
        children: "children",
        label: "name",
        parentId: "parentId",
        disabled: "disabled",
      },
      dialogData: {
        show: false,
        saving: false,
        edit: false,
        model: Object.assign({}, defaultOrgModel),
        modified: false,
        rules: {
          name: [{ required: true, message: "请输入单位名称" }],
          nameFullPy: [{ required: true, message: "请输入单位名称的拼音（全拼）" }],
          namePy: [{ required: true, message: "请输入单位名称的拼音（简拼）" }],
          groupId: [{ required: true, message: "请输入GroupId（OrgId）" }],
          orgType: [{ required: true, message: "请选择机构类型" }],
          isOrg: [{ required: true, message: "请选择单位类型" }],
        },
      },
    };
  },
  created() {
    this.bingBusinessList();
  },
  watch: {
    keyword(val) {
      if (val) {
        this.filterTree(val, true);
      }
    },
  },
  filters: {
    formatNodeType(type) {
      return OrgTypeEnum.getName(type, "未知");
    },
    dateFormat(value, dateStr) {
      if(value == '0001-01-01T00:00:00'){
        return ''
      }
      else{
        dateStr = dateStr || "yyyy-MM-dd hh:mm:ss";
        return formatDateTime(new Date(value), dateStr);
      }
    },
  },
  methods: {
    nodeClass(node, data) {
      if (
        this.keyword &&
        this.keyword.trim() &&
        (node.label.includes(this.keyword) ||
          data.nameFullPy.includes(this.keyword) ||
          data.namePy.includes(this.keyword))
      ) {
        return "node-keyword";
      } else if (data.status) {
        return "node-second";
      } else {
        return "node-primary";
      }
    },
    getChildrenList(pid) {
      this.loading = true;
      return getOrgTreeList({ parentId: pid }).then((res) => {
        let data = res.data;
        data.sort((x, y) => (y.order_id || 0) - (x.order_id || 0));
        this.loading = false;
        return data;
      });
    },
    loadTree(node, resolve) {
      if (node.level === 0) {
        this.getChildrenList("").then(resolve);
      } else {
        this.getChildrenList(node.data.id).then(resolve);
      }
    },
    refresh() {
      if (!this.keyword || !this.keyword.trim()) {
        let node = this.$refs.lazyTree.getNode(this.id);
        if (node == null) {
          ++this.lazyTreeKey;
        } else {
          node.loaded = false;
          node.expand();
        }
      } else {
        this.filterTree(this.keyword, false);
      }
    },
    filterTree(keyword, mesBool) {
      this.searching = this.loading = true;
      searchOrgTreeList({
        keyWord: keyword.trim(),
        pageNum: 1,
        pageSize: maxSearchCount,
      }).then((res) => {
        if (res.data.total > maxSearchCount && mesBool) {
          this.$message.warning(`搜索功能一次至多查询${maxSearchCount}条记录`);
        }
        this.orgs = res.data.list;
        this.searching = this.loading = false;
      });
    },
    bindEdit(data) {
      this.bindClear();
      this.dialogData.edit = true;
      this.dialogData.model = Object.assign({}, data);
      this.dialogData.model.openTime = this.dialogData.model.openTime=='0001-01-01T00:00:00' ? '' : this.dialogData.model.openTime
      this.dialogData.show = true;
      this.$nextTick(() => {
        this.$refs.orgForm.clearValidate();
        this.dialogData.modified = false;
      });
    },
    bindCreate(data) {
      this.bindClear();
      this.dialogData.edit = false;
      defaultOrgModel.parentId = data.id;
      defaultOrgModel.parentName = data.name;
      defaultOrgModel.parentGroupId = data.groupId;
      this.dialogData.model = Object.assign({}, defaultOrgModel);
      this.dialogData.show = true;
      this.$nextTick(() => this.$refs.orgForm.clearValidate());
    },
    resetForm() {
      this.dialogData.model = Object.assign({}, defaultOrgModel);
      this.$refs.orgForm.clearValidate();
    },
    bindDialogConfirm() {
      this.$refs.orgForm.validate((valid) => {
        if (valid) {
          this.dialogData.saving = true;
          this.dialogData.show = false;
          this.dialogData.saving = false;
          this.id = this.dialogData.model.parentId;
          this.dialogData.model.openTime =  this.dialogData.model.openTime || '0001-01-01T00:00:00'
          saveOrg(this.dialogData.model)
            .then((res) => {
              this.$message.success("保存成功");
              this.refresh();
            })
            .catch(() => {})
            .then(() => {
              this.resetForm();
            });
        } else {
          this.$message.error("验证失败");
        }
      });
    },
    bingBusinessList() {
      getBusinessList().then((res) => {
        this.businessList = res.data;
      });
    },
    querySearchCityAsync(queryString, cb) {
      this.dialogData.model.cityId = "";
      if (queryString) {
        getCitySelectList({ keyword: queryString.trim() }).then((res) => {
          this.citySelectList = res.data;
        });
      }

      setTimeout(() => {
        cb(this.citySelectList);
      }, 200);
    },
    handleSelectCity(item) {
      //this.cityId = item.id;
      this.dialogData.model.cityId = item.id;
      this.dialogData.model.cityName = item.name;
      console.log(item);
    },
    querySearchOrgAsync(queryString, cb) {
      this.dialogData.model.parentActualId = "";
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
      this.dialogData.model.parentActualId = item.id;
      this.dialogData.model.parentActualName = item.name;
      console.log(item);
    },
    orgDelete(data) {
      this.$confirm("确定删除“" + data.name + "”吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.id = data.parentId;
          orgDelete(data).then((res) => {
            if (res.data.code == 0) {
              this.$message.success(res.data.message);
              this.refresh();
            } else {
              this.$message.warning(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    showOrgData(data) {
      this.dataModelShow = true;
      this.dataModel = data;
    },
    bindClear() {
      this.dataModelShow = false;
      this.dataModel = {};
    },
    bindManageUser(index, row) {
      this.$router.push({ path: "/manager/user", query: { bid: row.id } });
    },
    bindNodeClick(data) {
      this.$emit("org-click", data);
    },
  },
};
</script>
<style lang="scss">
.orgs-bg {
  margin: 10px 5px;
  width: 48%;
  float: left;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 5px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox {
  margin-right: 25px;
}
.node-primary {
  color: #1890ff;
}
.node-second {
  color: #909399;
}
.node-keyword {
  color: red;
}
.node-type {
  font-size: 12px;
  margin-left: 5px;
  color: #c0c4cc;
}
.dialog-footer {
  text-align: center;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.bounce-enter,
.bounce-leave-to {
  transform: translate(10px);
  opacity: 0;
}
</style>
