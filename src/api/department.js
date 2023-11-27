import request from '@/utils/request'

// 获取组织架构信息
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除子部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

// 获取部门详细信息
export function getDetailDepartment(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门
export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
