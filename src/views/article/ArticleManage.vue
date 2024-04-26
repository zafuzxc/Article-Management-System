<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { getArticleListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref([]) //文章列表
const total = ref(0) //总条数
const loading = ref(false)
//定义请求参数对象
const params = ref({
  pagenum: 1, //当前页
  pagesize: 5, //每页条数
  cate_id: '',
  state: ''
})

//基于params参数获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await getArticleListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

const articleEditRef = ref()
//添加
const onAddArticle = () => {
  articleEditRef.value.open({})
}
//编辑
const onEdit = (row) => {
  articleEditRef.value.open(row)
}
//删除
const onDel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
//搜索 =>按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
//重置 =>将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

//添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    //更新成最后一页 再渲染
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单 -->
    <!-- inline属性将三个item在同一个行显示 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" circle plain @click="onEdit(row)"></el-button>
          <el-button type="danger" :icon="Delete" circle plain @click="onDel(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :background="true"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      style="margin-top: 30px; float: right"
    />
    <!-- 抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
