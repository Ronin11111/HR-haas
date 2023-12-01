<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              :model="formData"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item prop="username" label="姓名:">
                <el-input v-model="formData.username" style="width: 300px" />
              </el-form-item>
              <el-form-item prop="password2" label="密码:">
                <el-input
                  v-model="formData.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="saveUserDetailById"
                >更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </h2>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/views/employees/component/user-info.vue'
import JobInfo from '@/views/employees/component/job-info.vue'
import { getUserDetail } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userComponent: 'UserInfo',
      jobComponent: 'JobInfo',
      // 获取路由的params上的数据
      userId: this.$route.params.id,
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetail(this.userId)
    },
    async saveUserDetailById() {
      try {
        this.formData = await saveUserDetailById({ ...this.formData, password: this.password2 })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
</style>
