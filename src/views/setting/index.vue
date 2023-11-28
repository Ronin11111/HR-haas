<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" size="small" icon="el-icon-plus">
                新增角色
              </el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column
                type="index"
                label="序号"
                width="120"
                align="center"
              /> <el-table-column
                label="角色名称"
                width="240"
                prop="name"
                align="center"
              /> <el-table-column
                label="描述"
                prop="description"
              /> <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteInfo(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height:60px">
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
              <el-form label-width="120px" style="margin-top:40px">
                <el-form-item label="公司名称">
                  <el-input v-model="formData.name" disabled style="width: 400px;" />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="formData.companyAddress" disabled style="width: 400px;" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="formData.mailbox" disabled style="width: 400px;" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formData.remarks" disabled type="textarea" :row="3" style="width: 400px;" />
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/setting'
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
      formData: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      } // 公司信息
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
    }
  }
}
</script>

<style>

</style>
