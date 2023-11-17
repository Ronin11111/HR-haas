import request from '@/utils/request'

// 用户登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息接口
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取用户头像接口
export function getUserDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  return request({

  })
}
