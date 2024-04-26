<template>
  <page-container title="重置密码">
    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input style="width: 500px" v-model="formModel.oldPassword" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input style="width: 500px" v-model="formModel.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="rePassword">
        <el-input style="width: 500px" v-model="formModel.rePassword" placeholder="请确认新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onUpdatePassword">修改密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdatePasswordService } from '@/api/user'
import { useRouter } from 'vue-router'

const formModel = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})

const checkOldSame = (rule, value, cb) => {
  if (value === formModel.value.oldPassword) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== formModel.value.newPassword) {
    console.log(value)
    console.log(formModel.value.newPassword)
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}

const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 12, required: true, message: '请输入6到12位密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 12, required: true, message: '请输入6到12位密码', trigger: 'blur' },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}

const formRef = ref()
const userStore = useUserStore()
const Router = useRouter()
const onUpdatePassword = async () => {
  await formRef.value.validate()
  const { oldPassword: old_pwd, newPassword: new_pwd, rePassword: re_pwd } = formModel.value
  await userUpdatePasswordService({ old_pwd, new_pwd, re_pwd })
  ElMessage.success('密码修改成功')

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  Router.push('/login')
}
const onReset = () => {
  formRef.value.resetFields()
}
</script>
