<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="../assets/logo.png" alt="" class="logo">
        </el-col>
        <el-col :span="19">
            <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style>
.container {
  background-color: #b3c0d1;
  height: 100%;
}
.logo {
    vertical-align: middle;
}
.aside {
  background-color: skyblue;
}
.main {
  background-color: orange;
}
.middle {
    line-height: 60px;
    text-align: center;
    color: #fff;
}
.logout {
    text-decoration: none;
    line-height: 60px;
}
.header {
    padding: 0;
}
</style>
