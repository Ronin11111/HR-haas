<template>
  <div v-loading="loading" class="dashboard-container">
    <el-card class="tree-card">
      <!-- 头部区域 -->
      <tree-tools :tree-node="company" :is-show="false" @addDepart="addDepart" />
      <!-- 树形组织结构 -->
      <el-tree :data="departs" :props="propsDefault" :default-expand-all="true">
        <tree-tools slot-scope="{data}" :tree-node="data" @delDepart="getInfo" @addDepart="addDepart" @editDepart="editDepart" />
      </el-tree>
      <add-dept ref="addDept" :show-dia="visible" :tree-node="node" :show-dia.sync="visible" @addDepart="getInfo" />
    </el-card>
  </div>
</template>

<script>
import TreeTools from './compont/tree-tools.vue'
import AddDept from './compont/add-dept.vue'
import { getDepartments } from '@/api/department'
import { tranListToTree } from '@/utils'
import treeTools from './compont/tree-tools.vue'

export default {
  comments: {
    TreeTools,
    AddDept
  },
  components: { treeTools, AddDept },
  data() {
    return {
      company: {}, // 头部
      departs: [], // 树形数据
      propsDefault: {
        label: 'name'
      },
      visible: false, // 控制弹出层显示
      node: null, // 弹出层传参
      loading: false
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.loading = true
      const result = await getDepartments()
      // console.log(result)
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 调用递归方法，将数组结构转为树形结构
      this.departs = tranListToTree(result.depts, '')
      this.loading = false
    },
    addDepart(node) {
      this.visible = true
      // 注意：接收参数
      // console.log(node)
      this.node = node
    },
    editDepart(node) {
      this.visible = true
      this.node = node
      // 父组件上调用子组件中的方法
      this.$refs.addDept.getDeatail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
