import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from 'js-cookie' // 引入cookie工具包
import elementEN from 'element-ui/lib/locale/lang/en' // 英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 中文包
import customEN from './en' // 自定义英文包
import customZH from './zh' // 自定义中文包

Vue.use(VueI18n)
// 实例化VueI18n
export default new VueI18n({
  locale: cookie.get(('language')) || 'zh',
  messages: {
    zh: {
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  }
})
