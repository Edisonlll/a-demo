<template>
  <div class="loginwrap">
    <el-form label-position="top" label-width="80px" :model="formdata" class="loginform">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click.prevent="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post(`login`, this.formdata);
      const {
        data: {
          data: { token },
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        localStorage.setItem("token", token);
        this.$router.push({
          name: "home"
        });
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.loginwrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginform {
  padding: 30px;
  border-radius: 5px;
  background-color: #fff;
  width: 400px;
}
.login-btn {
  width: 100%;
}
</style>