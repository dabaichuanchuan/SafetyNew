<template>
  <div class="app-container">
    <div>
      <el-card
        class="box-card"
        style="
          width: 80%;
          margin-left: 10%;
          min-height: 150px;
          margin-top: 10px;
        "
        v-for="(item, order) in formData"
        :key="order"
      >
        <div>
          <el-form>
            <el-row type="flex">
              <el-col>
                <el-form-item label="字段名称：">
                  <el-input
                    placeholder="请输入内容"
                    v-model="item.label"
                    clearable
                    style="width: 350px;"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="字段类型：">
                  <el-select
                    v-model="item.type"
                    placeholder="请选择"
                    style="width: 300px;"
                  >
                    <el-option
                      v-for="types in typeOptions"
                      :key="types.value"
                      :label="types.label"
                      :value="types.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col>                
                <el-form-item label="字段描述：">
                  <el-input
                    placeholder="请输入内容"
                    v-model="item.label"
                    clearable
                    type="textarea"
                    style="width: 350px;"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
                <el-col>
                <el-form-item label="是否必填：">
                  <el-switch
                    v-model="item.requiredField"
                    :active-value="0"
                    :inactive-value="1"
                    active-text="是"
                    inactive-text="否"
                    style="width: 300px;"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div
          v-show="item.type == 'input'"
          style="color: grey; margin-top: 20px"
        >
          <el-input
            v-model="item.label"
            clearable
            style="width: 80%"
            disabled="flase"
          >
          </el-input>
        </div>
        <div v-if="item.type == 'text'" style="color: grey; margin-top: 20px">
          <el-input
            v-model="item.label"
            clearable
            style="width: 80%"
            type="textarea"
            disabled="flase"
          >
          </el-input>
        </div>
        <div
          class="radio"
          v-if="item.type == 'select'"
          style="color: grey; margin-top: 20px"
        >
          <div v-for="(j, index) in item.selectBoxName" :key="index">
            <el-input
              placeholder="请输入选项名"
              v-model="j.val"
              clearable
              style="width: 80%"
            >
            </el-input>
          </div>
          <div>
            <el-button
              type="text"
              @click="addselect(item.selectBoxName.length, order)"
              ><i
                class="el-icon-circle-plus-outline"
                style="font-size: 20px; margin-top: 10px"
              ></i
            ></el-button>
            <el-button type="text" @click="deleteselect(order)"
              ><i
                class="el-icon-remove-outline"
                style="font-size: 20px; margin-top: 10px"
              ></i
            ></el-button>
          </div>
        </div>
        <div
          class="radio"
          v-if="item.type == 'datePicker'"
          style="color: grey; margin-top: 20px"
        >
          <div>
            <el-date-picker
              placeholder="日期选择"
              v-model="item.inputValue"
              clearable
              style="width: 80%"
            >
            </el-date-picker>
          </div>
        </div>
        <div
          class="radio"
          v-if="item.type == 'upload'"
          style="color: grey; margin-top: 20px"
        >
          <div>
            <el-upload
              placeholder="附件"
              v-model="item.label"
              clearable
              style="width: 80%"
              :file-list="fileList"
            >
            </el-upload>
          </div>
        </div>
        <div
          v-if="item.type == 'showLable'"
          style="color: grey; margin-top: 20px"
        >
          <el-input
            placeholder="请输入说明内容"
            v-model="item.inputValue"
            :rows="3"
            type="textarea"
            clearable
          >
          </el-input>
        </div>
      </el-card>
      <div
        style="
          text-align: right;
          width: 80%;
          margin-left: 10%;
          margin-top: 10px;
        "
      >
        <el-tooltip
          class="item"
          effect="light"
          content="添加新组件"
          placement="top"
        >
          <el-button type="text" @click="adddiv" style="font-size: 30px"
            ><i class="el-icon-circle-plus"></i
          ></el-button>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="light"
          content="删除组件"
          placement="top"
        >
          <el-button type="text" @click="delectdiv" style="font-size: 30px"
            ><i class="el-icon-remove"></i
          ></el-button>
        </el-tooltip>
      </div>
      <div style="padding-bottom: 40px; text-align: center">
        <el-button type="primary" @click="tijiao()">预览</el-button>
      </div>
    </div>
    <div>
      <el-dialog title="预览" :visible.sync="dialogTableVisible">
        <formCreate
          v-model="yulanform"
          :rule="formrule"
          :option="option"
          @on-submit="onSubmit"
          style="width: 80%; margin-top: 20px"
        ></formCreate>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import formCreate from "@form-create/element-ui";

const templateClassform = {
  id: "",
  title: "",
  propertyType: 0,
  requiredField: 0,
  frequency: "",
  flag: 0,
};

export default {
  name: "NewForm",
  data() {
    return {
      dialogTableVisible: false,
      // 模板
      formData: [
        {
          label: "请输入内容",
          type: "input",
          inputValue: "输入内容",
          requiredField: 0,
          rateValue: "",
          selectBoxName: [
            {
              key: 0,
              val: "选项1",
            },
            {
              key: 1,
              val: "选项2",
            },
            {
              key: 2,
              val: "选项3",
            },
          ],
        },
      ],
      // 下拉选择框
      typeOptions: [
        {
          value: "input",
          label: "文本框",
        },
        {
          value: "text",
          label: "文本域",
        },
        {
          value: "select",
          label: "下拉选择",
        },
        {
          value: "datePicker",
          label: "日期选择",
        },
        {
          value: "upload",
          label: "附件",
        },
        {
          value: "showLable",
          label: "说明类型",
        },
        {
          value: "approvalCommon",
          label: "同时审批人",
        },
        {
          value: "approvalOrder",
          label: "序审批人",
        },
        {
          value: "cCPerson",
          label: "抄送人",
        },
      ],
      value: [],
      // 生成的表单规则
      formrule: [],
      // 表单实例对象
      yulanform: {},
      option: {
        submitBtn: {
          show: false,
        },
      },
    };
  },
  components: {
    formCreate: formCreate.$form(),
  },
  methods: {
    // 增加组件
    adddiv() {
      this.formData.push({
        label: "请输入内容",
        type: "input",
        requiredField: 0,
        inputValue: "输入内容",
        rateValue: "",
        selectBoxName: [
          {
            key: 0,
            val: "选项1",
          },
          {
            key: 1,
            val: "选项2",
          },
          {
            key: 2,
            val: "选项3",
          },
        ],
      });
    },
    // 删除组件
    delectdiv() {
      if (this.formData.length > 1) {
        this.formData.pop();
      }
    },
    // 增加单选按钮选项，实时更新数组用$set
    addradio(i, index) {
      this.formData[index].radioBoxName.push({
        key: i,
        val: "单选项" + ++i,
      });
    },
    deleteradio(index) {
      this.formData[index].radioBoxName.pop();
    },
    // 增加多选按钮选项
    addcheckbox(i, index) {
      this.formData[index].checkBoxName.push({
        key: i,
        val: "多选项" + ++i,
      });
    },
    deletecheckbox(index) {
      this.formData[index].checkBoxName.pop();
    },
    // 增加下拉框选项
    addselect(i, index) {
      this.formData[index].selectBoxName.push({
        key: i,
        val: "选项" + ++i,
      });
    },
    deleteselect(index) {
      this.formData[index].selectBoxName.pop();
    },
    tijiao() {
      this.formrule = [];
      for (let i = 0; i < this.formData.length; i++) {
        const item = this.formData[i];
        if (item.type === "select") {
          let h = item.selectBoxName.length;
          let options = [];
          for (let j = 0; j < h; j++) {
            options.push({
              value: item.selectBoxName[j].key,
              label: item.selectBoxName[j].val,
            });
          }
          this.formrule.push({
            field: item.label,
            title: item.label,
            type: item.type,
            requiredField: item.requiredField,
            options: options,
          });
        } else if (item.type === "text") {
          this.formrule.push({
            field: item.label,
            title: item.label,
            type: "input",
            requiredField: item.requiredField,
          });
        } else if (item.type === "datePicker") {
          this.formrule.push({
            field: item.label,
            title: item.label,
            type: item.type,
            requiredField: item.requiredField,
          });
        } else {
          this.formrule.push({
            field: item.label,
            title: item.label,
            type: item.type,
            requiredField: item.requiredField,
          });
          console.log(this.formrule);
        }
      }
      this.dialogTableVisible = true;
      console.log(this.formrule);
      alert(JSON.stringify(this.formrule));
    },
    onSubmit(formData) {
      alert(JSON.stringify(formData));
    },
  },
};
</script>

<style>
.radio .el-input__inner {
  width: 220px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}
.radio1 .el-input__inner {
  width: 100%;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}
.textarea .el-textarea__inner {
  width: 100%;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
}
</style>

