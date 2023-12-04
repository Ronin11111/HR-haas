<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <div>
        <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
      </div>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="$i18n.locale==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="$i18n.locale==='en'" command="en">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  methods: {
    changeLanguage(type) {
      Cookie.set('language', type)
      this.$i18n.locale = type
      if (this.$i18n.locale === 'zh') {
        return this.$message.success('语言设置成功！')
      }
      this.$message.success('Language setting successful!')
    }
  }
}
</script>

<style>

</style>
