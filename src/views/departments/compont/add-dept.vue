<template>
  <el-dialog :title="tieleType" :visible="showDia" @close="closeDialog">
    <el-form
      ref="formAll"
      :model="formData"
      :rules="formRule"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getNames"
        >
          <el-option
            v-for="obj in managerList"
            :key="obj.id"
            :label="obj.username"
            :value="obj.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          style="width: 80%"
          placeholder="1-300个字符"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
        <el-button size="small" @click="closeDialog">取 消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDetailDepartment, updateDepartment } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDia: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isExist = null
      if (this.formData.id) {
        // 编辑功能：查找同级下的所有节点(排除自身)，并判断是否有同名的节点
        isExist = depts.filter(item => item.id !== this.formData.id && item.pid === this.formData.pid).some(item => item.name === value)
      } else {
        // 新增功能：先查找对应节点下的子节点，再判断是否有同名的子节点
        isExist = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isExist ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 注意：这里不要尾随，
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isExist = null
      if (this.formData.id) {
        // 编辑功能：排除自身节点外，部门编号不重复且不为空
        isExist = depts.some(item => item.id !== this.formData.id && item.code === this.formData.code)
      } else {
      // 新增功能：部门编号不重复且不为空
        isExist = depts.some(item => item.code === value && value)
      }
      isExist ? callback(new Error(`同级部门下已经有${value}的编号了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      formRule: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }],
        code: [{ required: true, message: '部门编号不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }],
        manager: [{ required: true, message: '部门管理人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门名称要求1-300个字符', trigger: 'blur' }]
      },
      managerList: []
    }
  },
  computed: {
    tieleType() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    // 下拉框聚焦时，获取负责人列表
    async getNames() {
      this.managerList = await getEmployeeSimple()
    },
    submit() {
      // 先表单自动校验
      this.$refs.formAll.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updateDepartment(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepart')
          this.$emit('update:showDia', false)
        }
      })
    },

    closeDialog() {
      // 注意：resetFields（）方法仅清除表单中的数据，非表单数据不清楚
      // 解决方法：手动清除表单内数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDia', false)
      // 清空表单和校验规则
      this.$refs.formAll.resetFields()
    },

    // 编辑功能，数据回写
    // 注意：这里的node调用方法传参获取数据
    // 错误：通过props获取数据，因为props为异步方法
    async getDeatail(id) {
      this.formData = await getDetailDepartment(id)
    }
  }
}
</script>

<style>
</style>
