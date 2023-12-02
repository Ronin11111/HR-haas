<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template v-slot:after>
          <el-button size="small" type="primary" @click="addPermission(1,'0')">
            添加权限
          </el-button>
        </template>
      </PageTools>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹层 -->
      <el-dialog :title="dialogText" :visible.sync="isShow" @close="btnCancel">
        <el-form ref="formNew" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="name">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述" prop="name">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOk">确认</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import { updatePermission, addPermission, getPermissionDetail, delPermission, getPermissionList } from '@/api/permission'
import { tranListToTree } from '@/utils'
export default {
  comments: {
    PageTools
  },
  data() {
    return {
      tableData: [], // 表格数据
      isShow: false,
      title: '',
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.tableData = tranListToTree(await getPermissionList(), '0')
    },
    addPermission(type, id) {
      this.type = type
      this.formData.pid = id
      this.isShow = true
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.isShow = true
    },
    async delPermission(id) {
      try {
        await this.$confirm('确认要删除该权限点')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功！')
      } catch (err) {
        console.log(err)
      }
    },
    btnOk() {
      this.$refs.formNew.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updatePermission(this.formData)
          } else {
            await addPermission(this.formData)
          }
          this.isShow = false
          this.getPermissionList()
          this.$message.success('新增成功')
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.formNew.resetFields()
      this.isShow = false
    }
  }
}
</script>

<style>

</style>
