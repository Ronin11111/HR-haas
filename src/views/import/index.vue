<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  // 用参数来判断，是否是导入员工
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    // 注意：需要解构赋值---接收变量{}
    async success({ header, results }) {
      const userRelation = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 注意！！！将数据对象中中文key转为英文key需要着重理解！！！
      var arr = []
      results.map(item => {
        var newDate = {}
        Object.keys(item).forEach(key => {
          if (userRelation[key] === 'timeOfEntry' || userRelation[key] === 'correctionTime') {
            newDate[userRelation[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            newDate[userRelation[key]] = item[key]
          }
        })
        arr.push(newDate)
      })
      await importEmployee(arr)
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
