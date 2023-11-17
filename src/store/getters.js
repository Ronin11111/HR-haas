const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 将token作为公共数据进行存读
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
