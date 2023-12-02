<template>
  <div>
    <el-upload
      action="#"
      :limit="1"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="preview"
      :on-remove="removeImg"
      :on-change="changeImg"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="visible" :percentage="percentage" style="width: 180px;" />
    <el-dialog title="图片" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5'
// 实例化cos腾讯云对象，保存密钥信息
const cos = new Cos({ SecretId: 'AKIDvnT3NTUTVTKBxrdGD7qLf2GI9seFlBYo',
  SecretKey: 'A5rY9g6Rm9PTMLIRZhwCJRlCTm1FTq7G' })
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      currentFileUid: '', // 当前上传图片的uid
      percentage: 0,
      visible: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    removeImg(file, fileList) {
      this.visible = false
      this.fileList = fileList
      /* 方案二：
      this.filelist=this.filelist.filter(item=>item.uid!==file.uid)
      */
    },
    changeImg(file, fileList) {
      this.fileList = fileList.map(item => item)
      /* 方案二：
      if (this.fileList.some(item => item.url !== file.url)) {
        this.fileList.push(file)
      }
      */
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片不超过5M')
        return false
      }
      // 记录当前上传图片的uid
      this.currentFileUid = file.uid
      // 显示进度条
      this.visible = true
      return true
    },
    upload(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'ronin-01-1322833636', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可})
          onProgress: (params) => {
            // 进度条
            this.percentage = params.percent * 100
          }
        }, function(err, data) {
          if (!err && data.statusCode === 200) {
            // 上传成功
            this.fileList = this.fileList.map(item => {
              // 查找数组中对应uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
          }
          setTimeout(() => {
            this.visible = false
            this.percentage = 0
          }, 1000)
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
