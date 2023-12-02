<template>
  <el-dialog title="分配角色" :visible.sync="isShow" @close="btnCancel">
    <el-checkbox-group v-model="roleList">
      <el-checkbox v-for="item in allList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确认</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      allList: [], // 所有角色
      roleList: [] // 当前角色列表
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.allList = rows
    },
    // 获取当前用户信息
    async getUserDetail(id) {
      const { roleIds } = await getUserDetail(id)
      this.roleList = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.roleId, roleIds: this.roleList })
      this.$emit('update:isShow', false)
    },
    btnCancel() {
      // 清空数组
      this.roleList = []
      this.$parent.showRole = false
    }
  }
}
</script>

<style>

</style>
