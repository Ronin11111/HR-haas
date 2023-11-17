import { data } from 'jquery'
import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeStamp = 'hrsaas-ihrm-TimeStamp'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeStamp, Date.now())
}

// 读取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeStamp)
}
