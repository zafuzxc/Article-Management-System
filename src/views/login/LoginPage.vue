<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, reactive, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
// 整个用于提交的form数据对象
const formModel = reactive({
  username: '',
  password: '',
  repassword: ''
})
const form = ref()
const register = async () => {
  //注册成功之前先进行校验，校验成功就请求
  await form.value.validate()
  await userRegisterService(formModel)
  ElMessage.success('注册成功')
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()

const loading = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}
// 整个表单的校验规则
//1.非空校验
//2.长度校验
//3.正则校验 pattern
//4.自定义校验 validator:(rule,value,callback)
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, required: true, message: '请输入6到12位密码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是字母、数字或下划线组成', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, required: true, message: '请输入6到12位密码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是字母、数字或下划线组成', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback() //必须要写回调
        }
      },
      trigger: 'blur'
    }
  ]
}
watch(isRegister, () => {
  formModel.username = ''
  formModel.password = ''
  formModel.repassword = ''
})
</script>
<!-- （1）el-form => :model="ruleFrom"   绑定整个form的数据对象 -->
<!-- （2）el-form => :rules="rules"      绑定整个rules的规则对象 -->
<!-- （3）表单元素 => v-model='ruleForm'  给表单元素，绑定form的子属性 -->
<!-- （4）prop配置生效的是哪个校验规则（和rules中的字段要对应） -->
<template>
  <el-row class="login-page">
    <el-col :span="14" class="bg">
      <div id="title">图书管理系统</div>
    </el-col>
    <el-col :span="6" :offset="2" class="form">
      <!-- 注册表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="formModel.repassword" :prefix-icon="Lock" type="password" placeholder="请输入再次密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space> 注册 </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="loading" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('https://pic4.zhimg.com/v2-e29c928d7c71c4c93fc5a08de98ed681_r.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  #title {
    font-size: 60px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-top: 300px;
    font-family: '楷体';
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
