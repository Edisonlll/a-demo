<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button type="primary" plain @click="showRole()" class="addrole">添加角色</el-button>
    <el-table :data="roles" style="width: 100%" height="300px">
      <el-table-column type="expand" width="80"></el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showDiaEditUser(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="showdeldia(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="showDiaSetRole(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created(){
      this.getRolesTable()
  },
  methods: {
    showRole() {},
    async getRolesTable(){
        const res = await this.$http.get(`roles`)
        console.log(res);
        const {data,meta:{status}} = res.data
        if(status===200){
            this.roles = data
        }
        
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.addrole {
  margin-top: 10px;
}
</style>
