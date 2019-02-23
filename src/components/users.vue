<template>
  <el-card class="box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchbox">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        clearable
        @clear="getAlluser()"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchdata()"></el-button>
      </el-input>
      <el-button type="primary" plain @click="showAddUsers()">添加用户</el-button>
    </el-row>
    <el-table :data="list" style="width: 100%" height="300px" v-loading="loading">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="page"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :required="true">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="Adduser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="edituser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-width="80px">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option
              v-for="(item) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      list: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      selectVal: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      currUsersId: -1,
      roles: [],
      loading: true
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async setRole() {
      const res = await this.$http.put(`users/${this.currUsersId}/role`, {
        rid: this.selectVal
      });
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleRole = false;
        this.$message.success(msg);
      }
    },
    async showDiaSetRole(user) {
      this.dialogFormVisibleRole = true;
      this.formdata.username = user.username;
      this.currUsersId = user.id;
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const { data } = res.data;
      // console.log(data);
      this.roles = data;
      const res1 = await this.$http.get(`users/${user.id}`);
      // console.log(res1)
      this.selectVal = res1.data.data.rid;
    },
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
      //  console.log(res);
    },
    async edituser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      console.log(this.formdata.id);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async showDiaEditUser(users) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${users.id}`);
      console.log(res);
      this.formdata = res.data.data;
    },
    showdeldia(users) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${users.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async Adduser() {
      const res = await this.$http.post(`users`, this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      // console.log(res);

      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.$message.success(msg);
        this.getTableData();
      } else {
        this.$message.error(msg);
      }
    },
    showAddUsers() {
      this.dialogFormVisibleAdd = true;
      this.formdata = {};
    },
    getAlluser() {
      this.getTableData();
    },
    searchdata() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );

      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        this.loading=false
      }
    }
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
.searchbox {
  margin-top: 20px;
}
.input-with-select {
  width: 350px;
}
.page {
  margin-top: 20px;
}
</style>
