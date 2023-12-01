<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="cancle">
    <!-- 表单 -->
    <el-form ref="formInfo" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 树形结构 -->
        <el-tree v-if="showTree" v-loading="loading" :data="deptList" :props="{label: 'name'}" :default-expand-all="true" @node-click="deptsSure" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancle">取消</el-button>
          <el-button type="primary" size="small" @click="isSure">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/department'
import { tranListToTree } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不可为空', trigger: 'blur' }, { min: 2, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不可为空', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        // 注意:部门选择的规则校验方式为change，需要在el-tree中选择数据
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      showTree: false, // 树形结构显
      loading: false, // 加载遮罩
      deptList: [] // 组织部门数据
    }
  },
  methods: {
    async getDepartments() {
      this.loading = true
      this.showTree = true
      const { depts } = await getDepartments()
      this.deptList = tranListToTree(depts, '')
      this.loading = false
    },
    deptsSure(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },

    // 确定
    async isSure() {
      try {
        await this.$refs.formInfo.validate()
        await addEmployee(this.formData)
        // 使用this.$parent，即调用组件的父元素上的方法和属性
        this.$parent.getEmployeeInfo()
        this.$parent.isShow = false
      } catch (err) {
        console.log(err)
      }
    },

    // 取消
    cancle() {
      this.$emit('update:showDialog', false)
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formInfo.resetFields
    }
  }
}
</script>

<style>

</style>
