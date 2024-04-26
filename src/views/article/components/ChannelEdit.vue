<script setup>
import { ref } from 'vue'
import { addArticleService, editArticleService } from '@/api/article.js'
const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  cate_alias: [{ required: true, message: '请输入分类别名', trigger: 'blur' }]
}
// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, ..., ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row } //添加->重置表单内容，编辑->存储了需要回显的数据
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  if (formModel.value.id) {
    await editArticleService(formModel.value)
    console.log('编辑成功')
    ElMessage.success('编辑成功')
  } else {
    await addArticleService(formModel.value)
    console.log('添加成功')
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="500">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
