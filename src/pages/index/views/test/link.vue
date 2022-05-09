<template>
  <el-card class="form-container" shadow="hover" v-loading="loading">
    <div slot="header" class="clearfix">
      <div>链接与二维码</div>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-dropdown v-loading="drawing" @command="bindDownCommand">
            <div class="qr-bg">
              <vue-qr
                :size="150"
                :margin="0"
                :auto-color="true"
                :dot-scale="1"
                :text="url">
              </vue-qr>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{width: 150, font: 14}">150*150</el-dropdown-item>
              <el-dropdown-item :command="{width: 256, font: 28}">256*256</el-dropdown-item>
              <el-dropdown-item :command="{width: 512, font: 56}">512*512</el-dropdown-item>
              <el-dropdown-item :command="{width: 1024, font: 112}">1024*1024</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="17">
          <div class="test-title">{{test.title}}</div>
          <el-divider content-position="left">操作</el-divider>
          <div class="input-url">
            <el-input placeholder="请输入内容" v-model="url" disabled>
              <el-button 
                slot="prepend" 
                icon="el-icon-copy-document"
                v-clipboard:copy="url"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">
                  复制
              </el-button>
              <el-button slot="append" icon="el-icon-discover" @click="bindOpenUrl">打开</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <vue-qr
      ref="qrcode"
      v-show="false"
      :size="size.width"
      :margin="0"
      :auto-color="true"
      :dot-scale="1"
      :text="url">
    </vue-qr>
    <div>
      <canvas ref="downcode" class="down-code" :width="size.width" :height="height"></canvas>
    </div>
  </el-card>
</template>
<script>
  import { getTestDetail, genTestUrl } from '../../api/test'
  import VueQr from 'vue-qr'

  export default {
    components: {
      VueQr,
    },
    data () {
      return {
        loading: false,
        drawing: false,
        test: {},
        url: '',
        size: {
          width: 1024,
          font: 14
        },
        height: 1024
      }
    },
    created () {
      if(this.test.id = this.$route.query.id) {
        this.url = genTestUrl(this.test.id)
        this.getTest()
      }
    },
    methods: {
      refreshQRCode(text, max, font) {
        const ctx = this.$refs.downcode.getContext('2d')
        ctx.font = `${font}px SimSun, Songti SC`

        const source = text.split('')
        let line = '', count = 1
        for(let i = 0; i < source.length; i++) {
          let str = line + source[i]
          let width = ctx.measureText(str).width
          if(width > max && i > 0) {
            count++
            line = source[i]
          } else {
            line = str
          }
        }

        const lineHeight = font * 1.2
        this.height = max + (count * lineHeight + font * 0.5)
      },
      downloadQRCode(text, max, font) {
        const source = this.$refs.qrcode.$el
        const canvas = this.$refs.downcode
        const ctx = canvas.getContext('2d')
        ctx.font = `${font}px SimSun, Songti SC`

        const charr = text.split(''), lines = []
        let line = ''
        for(let i = 0; i < charr.length; i++) {
          let str = line + charr[i]
          let width = ctx.measureText(str).width
          if(width > max && i > 0) {
            lines.push(line)
            line = charr[i]
          } else {
            line = str
          }
        }
        lines.push(line)

        this.$nextTick(() => {
          ctx.drawImage(source, 0, 0, max, max)
          ctx.font = `${font}px SimSun, Songti SC`
          const lineHeight = font * 1.2
          for(let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 0, max + lineHeight * (i + 1))
          }
          const src = canvas.toDataURL('image/png')
          let a = document.createElement('a')
          let event = new MouseEvent('click')
          a.download = '二维码'
          a.href = src
          a.dispatchEvent(event)
        })
      },
      bindDownCommand(command) {
        if(this.drawing) return
        this.drawing = true
        this.size = Object.assign(this.size, command)
        this.refreshQRCode(this.test.title, command.width, command.font)
        setTimeout(() => {
          this.downloadQRCode(this.test.title, command.width, command.font)
          this.drawing = false
        }, 1500)
      },
      getTest() {
        this.loading = true
        getTestDetail(this.test.id).then(res => {
          this.test = res.data
          this.refreshQRCode(this.test.title, this.size.width, this.size.font)
        }).catch(() => {}).then(() => this.loading = false)
      },
      onCopySuccess() {
        this.$message.success('复制成功')
      },
      onCopyError() {
        this.$message.error('复制失败')
      },
      bindOpenUrl() {
        window.open(this.url)
      }
    }
  }
</script>
<style>
  .qr-bg {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 10px;
    display: inline-block;
    cursor: pointer;
  }
  .test-title {
    padding: 15px 0;
    font-size: 18px;
  }
  .input-url .el-input.is-disabled .el-input__inner {
    background-color: #FFF;
    color: #000;
    cursor: pointer;
  }
  .down-code {
    position: absolute;
    top: -9999;
    left: -9999;
    z-index: 0;
    display: none;
  }
</style>