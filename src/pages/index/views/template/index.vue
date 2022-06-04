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
          <el-form-item label="关键字：">
            <el-input
              v-model="listQuery.keyWord"
              class="input-width"
              placeholder="请输入关键字"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select
              v-model="listQuery.type"
              class="input-width"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in templateTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业态：">
            <el-select
              v-model="listQuery.business"
              class="input-width"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in businessOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              v-model="listQuery.orgType"
              class="input-width"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in orgTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营状态：">
            <el-select
              v-model="listQuery.operationState"
              class="input-width"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in templateOperationStateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.flag"
              class="input-width"
              clearable
              placeholder="全部"
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
        <el-button icon="el-icon-document-add" size="mini"> 添加 </el-button>
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
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">{{
              scope.row.type | formatTemplateTypeEnumName
            }}</template>
          </el-table-column>
          <el-table-column label="分类" align="center">
            <template slot-scope="scope">{{ scope.row.classId }}</template>
          </el-table-column>
          <el-table-column label="业态" align="center">
            <template slot-scope="scope">{{ scope.row.businessId }}</template>
          </el-table-column>
          <el-table-column label="区域" align="center">
            <template slot-scope="scope">{{
              scope.row.orgType | formatOrgTypeEnumName
            }}</template>
          </el-table-column>
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              <div>创建时间：{{ scope.row.createrTime | formatTime }}</div>
              <div>更新时间：{{ scope.row.modifierTime | formatTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <!-- <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="bindEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template> -->
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
  </div>
</template>
<script>
import { getTemplatePage } from "../../api/template/template";
import { getBusinessList } from "../../api/manager/business";
import {
  CommonFlagEnum,
  TemplateTypeEnum,
  OrgTypeEnum,
  TemplateOperationStateEnum,
} from "@/utils/enum";
import { formatDateTime } from "@/utils/common";

const defaultListQuery = {
  id: "",
  keyWord: "",
  type: "",
  orgType: "",
  business: "",
  operationState: "",
  flag: "",
  pageNum: 1,
  pageSize: 10,
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
      orgTypeOptions: OrgTypeEnum.items(),
      templateTypeOptions: TemplateTypeEnum.items(),
      templateOperationStateOptions: TemplateOperationStateEnum.items(),
      businessOptions: [],
    };
  },
  computed: {},
  created() {
    this.getBusinessOptions();
    this.getList();
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), "yyyy-MM-dd hh:mm:ss") : "";
    },
    formatTemplateTypeEnumName(type) {
      return TemplateTypeEnum.getName(type);
    },
    formatOrgTypeEnumName(type) {
      return TemplateTypeEnum.getName(type);
    },
  },
  methods: {
    getBusinessOptions() {
      getBusinessList().then((res) => {
        this.businessOptions = res.data;
      });
    },
    getList(paged) {
      if (!paged) this.listQuery.pageNum = 1;
      this.listLoading = true;
      getTemplatePage(this.listQuery).then((res) => {
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
