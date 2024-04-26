<template>
  <page-container title="基本资料">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item style="width: 500px" label="用户名" prop="username">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item style="width: 500px" label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item style="width: 500px" label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/article'
import { useUserStore } from '@/stores'

const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const form = ref({
  id,
  username,
  nickname,
  email
})
const formRef = ref()

const submitForm = async () => {
  //等待校验结果
  await formRef.value.validate()
  //提交修改
  await userUpdateInfoService(form.value)
  //通知user模块，更新数据
  getUser
  ElMessage.success('提交成功')
}

const rules = {
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }]
}
</script>
