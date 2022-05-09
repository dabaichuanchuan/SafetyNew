<template>
  <div class="import-bg">
    <el-button :size="size" :type="type" style="padding: 0;" icon="el-icon-upload" @click.stop="dialogVisible=true">导入表格
    </el-button>
    <el-dialog
      title="从Excel上传"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="77%">
      <div v-if="$slots.preview" class="upload-preview">
        <slot name="preview"></slot>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-link href="/static/test_template.xlsx" style="margin-right:10px; font-size:12px" type="primary" download="考试导入模板.xlsx">点击下载模板</el-link>
        <el-upload 
          style="display: inline-block;" 
          ref="upload" 
          action="" 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :auto-upload="false" 
          :on-change="bindFileChange"
          :show-file-list="false"
          :limit="1">
          <el-button :loading="processing" size="small" icon="el-icon-upload">点击上传</el-button>
        </el-upload>
        <el-divider direction="vertical"></el-divider>
        <el-button size="small" @click.stop="bindCancel">取 消</el-button>
        <el-button type="primary" size="small" @click.stop="bindConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import xlsx from 'xlsx'

export default {
  name: 'importExcel',
  props: {
    size: {
      validator: function(value) {
        return ['medium','small','mini'].includes(value)
      }
    },
    type: {
      validator: function(value) {
        return ['text','primary',''].includes(value)
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      processing: false
    }
  },
  methods: {
    bindConfirm() {
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
      this.$emit('upload-confirm')
    },
    bindCancel() {
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
      this.$emit('upload-cancel')
    },
    bindFileChange(file) {
      this.processing = true
      this.readFile(file.raw).then(dataBinary => {
        let workBook = xlsx.read(dataBinary, {type: 'binary', cellDates: true})
        let workSheet = workBook.Sheets[workBook.SheetNames[0]]
        const data = xlsx.utils.sheet_to_json(workSheet)
        this.$refs.upload.clearFiles()
        this.$emit('upload-review', data)
        this.processing = false
      })
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = e => resolve(e.target.result)
        reader.onerror = err => reject(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .import-bg {
    display: inline;
    .upload-area {
      text-align: center;
    }
  }
</style>
