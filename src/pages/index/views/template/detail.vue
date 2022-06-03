<template>
  <div class="app-container">
    <el-card class="form-bg" shadow="hover">
      <el-divider class="line">基础信息设置</el-divider>
      <el-form
        :inline="true"
        size="small"
        :model="templateformData.model"
        ref="defaultForm"
        :rules="templateformData.rules"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item label="模板标题：" prop="name">
              <el-input
                v-model="templateformData.model.name"
                class="input-width"
                placeholder="请输入模板标题"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item label="事项级别：" prop="grade">
              <el-select
                v-model="templateformData.model.grade"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运营状态：" prop="OperationState">
              <el-select
                v-model="templateformData.model.OperationState"
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in templateOperationStateOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属业态：" prop="businessId">
              <el-select
                v-model="templateformData.model.businessId"
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
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="所属分类：" prop="classId">
              <el-select
                v-model="templateformData.model.classId"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in templateClassList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属企业：" prop="tenantId">
              <el-select
                v-model="templateformData.model.tenantId"
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
            <el-form-item label="区域类型：" prop="orgType">
              <el-select
                v-model="templateformData.model.orgType"
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in OrgTypeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>            
             <el-form-item label=" 生成频次：" prop="frequency">
              <el-select
                v-model="templateformData.model.frequency"
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in templateFrequencyOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
             <el-form-item label="填报岗位：" prop="fillPositionId">
              <el-select
                v-model="templateformData.model.fillPositionId"
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="item in fillPositionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开 始 时 间：" prop="beginDate">
              <el-date-picker
                v-model="templateformData.model.beginDate"
                :editable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                style="width: 205px"
              />
            </el-form-item>
            <el-form-item label="结 束 时 间：" prop="endDate">
              <el-date-picker
                v-model="templateformData.model.endDate"
                :editable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="结束时间"
                style="width: 205px"
              />
            </el-form-item>
           <el-form-item label="节 点 分 值：">
              <el-input
                v-model="templateformData.model.score"
                class="input-width"
                placeholder="请输入节点分值"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>           
            <el-form-item label="是 否 启 用：" prop="flag">
              <el-switch
                v-model="templateformData.model.flag"
                :active-value="0"
                :inactive-value="1"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="line">节点模板设置</el-divider>
        <el-row type="flex">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button type="primary">选择模板文件</el-button>
          </el-upload>
        </el-row>
        <el-divider class="line">表单属性设置</el-divider>
      </el-form>
      <span style="text-align: center; display: block">
        <el-button size="small">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="bindDialogConfirm()"
          :loading="templateformData.saving"
          >确 定</el-button
        >
      </span>
    </el-card>
  </div>
</template>


<script>
import {
  TemplateGradeEnum,
  TemplateOperationStateEnum,
  OrgTypeEnum,
  TemplateFrequencyEnum,
} from "@/utils/enum";
import {
  getTemplateClassList,
  saveTemplate,
} from "../../api/template/template";
import { getBusinessList } from "../../api/manager/business";
import { getEnterpriseList } from "../../api/manager/enterprise";
import { getPositionPage } from "../../api/manager/position";
import { formatDateTime } from "@/utils/common";

const defaultListQuery = {
  id: "",
  keyWord: "",
  grade: "",
  business: "",
  tenantId: '',
  flag: "",
  pageNum: 1,
  pageSize: 100,
};

const templateform = {
  id: "",
  name: "",
  type: 0,
  classId: "",
  businessId: "",
  orderNo: 0 ,
  beginDate: "",
  endDate: "",
  fillPositionId: "",
  orgType: "",
  score: 0,
  grade: "",
  OperationState: "",
  tenantId: "",
  frequency: "",
  flag: 0,
};

export default {
  name: "defaultList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      gradeOptions: TemplateGradeEnum.items(),
      templateOperationStateOptions: TemplateOperationStateEnum.items(),
      templateFrequencyOptions: TemplateFrequencyEnum.items(),
      OrgTypeOptions: OrgTypeEnum.items(),
      businessList: [],
      enterpriseOptions: [],
      templateClassList: [],
      fillPositionList: [],
      templateformData: {
        show: false,
        saving: false,
        model: Object.assign({}, templateform),
        rules: {
          name: [{ required: true, message: "请输入模板标题" }],
          grade: [{ required: true, message: "请选择级别" }],
          OperationState: [{ required: true, message: "请选择运营状态" }],
          businessId: [{ required: true, message: "请选择业态" }],
          fillPositionId: [{ required: true, message: "请选择填报岗位" }],
          classId: [{ required: true, message: "请选择所属分类" }],
          tenantId: [{ required: true, message: "请选择所属企业" }],
          orgType: [{ required: true, message: "请选择区域类型" }],
          frequency: [{ required: true, message: "请选择生成频次" }],
        },
      },
    };
  },
  computed: {},
  created() {
    this.bingBusinessList();
    this.bingEnterpriseOptions();
    this.bingTemplateClassList();
    this.bingfillPositionList();
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), "yyyy-MM-dd hh:mm:ss") : "";
    },
  },
  methods: {
    bingBusinessList() {
      getBusinessList().then((res) => {
        this.businessList = res.data;
      });
    },
    bingEnterpriseOptions() {
      const query = {};
      getEnterpriseList(query).then((res) => {
        this.enterpriseOptions = res.data;
      });
    },
    bingTemplateClassList() {
      const query = {};
      getTemplateClassList(query).then((res) => {
        this.templateClassList = res.data;
      });
    },
    bingfillPositionList() {
      getPositionPage(this.listQuery).then((res) => {
        this.fillPositionList = res.data.list;
      });
    },
    bindDialogConfirm() {
      this.$refs.defaultForm.validate((valid) => {
        if (valid) {
          saveTemplate(this.templateformData.model)
            .then((res) => {
              this.$message.success("保存成功");
            })
            .catch(() => {})
            .then(() => {
            });
        } else {
          this.$message.error("保存失败");
        }
      });
    },
  },
};
</script>


<style lang="scss">
.form-bg {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 10px;
  width: 100%;
  .row {
    margin: 0 0 10px 0;
    text-align: center;
  }
}
.test-bg {
  margin: 0 0 0 10px;
  .paper {
    margin: 0 auto;
    .field {
      border-radius: 10px;
      overflow: hidden; // Fix chrome子元素无法撑开父元素BUG
      .oper {
        display: none;
      }
      .desc {
        color: #f56c6c;
      }
    }
    .field:hover {
      background-color: #fafafa;
      .oper {
        display: block;
      }
    }
    .footer {
      text-align: center;
      margin: 15px 0;
    }
  }
}
.icon {
  margin-right: 5px;
}
.line .el-divider__text {
  font-size: 12px;
  color: #909399;
}
</style>