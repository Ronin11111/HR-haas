<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :is-show="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportOut">导出</el-button>
          <el-button size="small" type="primary" @click="isShow=true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card>
        <el-table v-loading="loading" border :data="employeeList" style="width: 100%">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="row">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="row">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="row">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            layout="prev, pager, next"
            :total="page.total"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="isShow" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/component/add-employee.vue'
import { formatDate } from '@/filters'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      employeeList: [], // 员工列表数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 遮罩效果
      isShow: false
    }
  },
  created() {
    this.getEmployeeInfo()
  },
  methods: {
    async getEmployeeInfo() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.employeeList = rows
      this.page.total = total
      this.loading = false
    },
    pageChange(newPage) {
      this.page.page = newPage
      this.getEmployeeInfo()
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该角色信息?')
        await delEmployee(id)
        this.getEmployeeInfo()
        this.$message.success('删除成功！')
      } catch (err) {
        console.log(err)
      }
    },

    // 数据导出excel格式
    async exportOut() {
      // 中英文对应规则
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = this.formatJson(headers, rows)
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 使用懒加载
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 (必填)
          data, // 具体数据 (必填)
          filename: '员工数据导出表', // 导出文件名
          multiHeader, // 复杂表头的内容
          merges // 表头需合并的部分
        })
      })
    },
    // 将数组转换为二维数组
    formatJson(header, row) {
      return row.map(item => {
        return Object.keys(header).map(key => {
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            // 格式化时间
            return formatDate(item[header[key]])
          } else if (header[key] === 'formOfEmployment') {
            // 格式化入职方式
            const res = EmployeeEnum.hireType.find(obj => obj.id === item[header[key]])
            return res ? res.value : '未知'
          }
          return item[header[key]]
        })
      })
    }
  }
}
</script>

<style>

</style>
