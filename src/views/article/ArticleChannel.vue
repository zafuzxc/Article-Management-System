<script setup>
import { ref } from 'vue'
import { getArticleService, delArticleService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage } from 'element-plus'
const articleList = ref([])
const loading = ref(false)
const dialog = ref()
const getArticleList = async () => {
  loading.value = true
  const res = await getArticleService()
  articleList.value = res.data.data
  loading.value = false
}
getArticleList()
const onEdit = (row) => {
  dialog.value.open(row)
}
const onDel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await delArticleService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

const onAddArticle = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getArticleList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddArticle">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100px">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" circle plain @click="onEdit(row)"></el-button>
          <el-button type="danger" :icon="Delete" circle plain @click="onDel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
