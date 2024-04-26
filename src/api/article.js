import request from '@/utils/request'
//获取文章分类
export const getArticleService = () => request.get('/my/cate/list')
//添加文章分类
export const addArticleService = (data) => request.post('/my/cate/add', data)
//编辑文章分类
export const editArticleService = (data) => request.put('/my/cate/info', data)

// 删除文章分类
export const delArticleService = (id) =>
  request.delete('my/cate/del', {
    params: {
      id
    }
  })

// 获取文章列表
export const getArticleListService = (params) => request.get('/my/article/list', { params })

//添加文章
// data是一个formData格式的对象
export const publishArticleService = (data) => request.post('/my/article/add', data)

//获取文章详情
export const getDetailService = (id) => request.get('/my/article/info', { params: { id } })
//编辑文章

export const editDetailService = (data) => request.put('/my/article/info', data)
//删除文章
export const artDelService = (id) => request.delete('/my/article/info', { params: { id } })

// 更新用户信息
export const userUpdateInfoService = ({ id, nickname, email }) => request.put('/my/userinfo', { id, nickname, email })
