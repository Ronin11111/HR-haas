// 该文件负责所有公共组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Print from 'vue-print-nb'
import Lang from './Lang'

export default {
  // Vue.use()--本质为执行其中的install方法，Vue为全局对象
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('Lang', Lang)
    Vue.use(Print)
  }
}
