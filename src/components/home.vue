<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="../assets/logo.png" alt class="logo">
        </el-col>
        <el-col :span="19">
          <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="handlelogout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <el-submenu :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  beforeMount() {
    
  },
  created() {
    this.getmenu();
  },

  methods: {
    async getmenu() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.menus = data;
      }
    },
    handlelogout() {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    }
  }
};
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
  background-color: #ffffff;
}
.main {
  background-color: #ccc;
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
