<template>
  <el-card>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px;margin-right:10px" @change="changeDate">
        <el-option v-for="item in currentList" :key="item" :value="item" :label="item" />
      </el-select>
      <el-select v-model="currentMon" size="small" style="width:120px" @change="changeDate">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template
        slot="dateCell"
        slot-scope="{date, data}"
        class="content"
      >
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script>
export default {
  filters: { getDay(val) {
    // 以-分割数组
    const date = val.split('-')[2]
    // 去除数字前的0
    return date.startsWith('0') ? date.substr(1) : date
  } },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMon: null,
      currentYear: null,
      currentList: [],
      currentDate: null
    }
  },
  created() {
    this.currentMon = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.currentList = Array.from(Array(11), (v, i) => this.currentYear + i - 5)
    this.changeDate()
  },
  methods: {
    changeDate(val) {
      const year = this.currentYear
      const month = this.currentMon
      this.currentDate = new Date(`${year}-${month}-1`)
    },
    isWeek(val) {
      return val.getDay() === 0 || val.getDay() === 6
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  /* margin-left: 10px; */
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>

