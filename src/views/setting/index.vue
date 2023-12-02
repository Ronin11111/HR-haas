<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="dialogShow = true"
              >
                新增角色
              </el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column
                type="index"
                label="序号"
                width="120"
                align="center"
              />
              <el-table-column
                label="角色名称"
                width="240"
                prop="name"
                align="center"
              />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editInfo(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteInfo(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-row>
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                :closable="false"
                show-ico
              />
              <el-form label-width="120px" style="margin-top: 40px">
                <el-form-item label="公司名称">
                  <el-input
                    v-model="formData.name"
                    disabled
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input
                    v-model="formData.companyAddress"
                    disabled
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input
                    v-model="formData.mailbox"
                    disabled
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remarks"
                    disabled
                    type="textarea"
                    :row="3"
                    style="width: 400px"
                  />
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <!-- 编辑部门弹出层组件 -->
        <el-dialog title="编辑部门" :visible="dialogShow" @close="btnCancel">
          <el-form
            ref="formRole"
            :model="roleForm"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" @click="btnCancel">取消</el-button>
              <el-button
                size="small"
                type="primary"
                @click="btnOK"
              >确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 分配权限弹出层 -->
        <el-dialog title="分配权限" :visible.sync="showPermiss" @click="isCancle">
          <el-tree
            ref="permTree"
            :data="permList"
            :props="propRule"
            :default-expand-all="true"
            :show-checkbox="true"
            :check-strictly="true"
            :default-checked-keys="checkList"
            node-key="id"
          />
          <el-row type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" type="primary" @click="isOk">确认</el-button>
              <el-button size="small" @click="isCancle">取消</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTree } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [], // 角色信息列表
      page: {
        page: 1,
        pagesize: 5,
        total: 0 // 记录总数
      }, // 分页信息
      formData: {}, // 公司信息
      dialogShow: false, // 编辑部门弹出层
      showPermiss: false, // 权限分配弹出层
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      permList: [], // 权限列表
      propRule: {
        label: 'name'
      }, // 树形规则
      roleId: '', // 当前角色ID
      checkList: [] // 已分配的权限
    }
  },
  computed: {
    // 获取公司ID
    ...mapGetters(['companyId'])
  },
  created() {
    this.getInfolist()
    this.getCompany()
  },
  methods: {
    // 获取角色列表数据
    async getInfolist() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },

    // 分页栏变化，获取数据
    changePage(newPage) {
      this.page.page = newPage
      // 获取最新列表
      this.getInfolist()
    },

    // 获取公司信息
    async getCompany() {
      this.formData = await getCompanyInfo(this.companyId)
    },

    // 删除角色
    async deleteInfo(id) {
      try {
        await this.$confirm('确认删除该角色信息?')
        await deleteRole(id)
        this.getInfolist()
        this.$message('删除角色成功！')
      } catch (err) {
        console.log(err)
      }
    },

    // 获取角色信息
    async editInfo(id) {
      // 注意：先获取数据，再弹出层
      this.roleForm = await getRoleDetail(id)
      this.dialogShow = true
    },

    // 编辑/新增角色确认信息
    async btnOK() {
      try {
        // 注意：使用await执行表单验证
        await this.$refs.formRole.validate()
        if (this.roleForm) {
          await addRole(this.roleForm)
        } else {
          await updateRole(this.roleForm)
        }
        this.getInfolist()
        this.dialogShow = false
        // 注意：关闭弹层会自动调用dialo的@close方法，即btnCancel
        this.$message.success('修改成功')
      } catch (err) {
        console.log(err)
      }
    },

    // 关闭弹出层
    btnCancel() {
      this.dialogShow = false
      this.$refs.roleForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },

    // 分配权限
    async assignPerm(id) {
      this.permList = tranListToTree(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id)
      this.checkList = permIds
      this.roleId = id
      this.showPermiss = true
    },
    async isOk() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('权限分配成功!')
      this.showPermiss = false
    },
    isCancle() {
      this.checkList = []
      this.showPermiss = false
    }
  }
}
</script>

<style>
</style>
