<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button type="primary" plain @click="showRole()" class="addrole">添加角色</el-button>
    <el-table :data="roles" style="width: 100%" height="300px" v-loading="loading" @expand-change="fn1">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable @close="deltag(scope.row,item1)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deltag(scope.row,item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    @close="deltag(scope.row,item3)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="showDiaSetRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree
        ref="treeDom"
        :data="treelist"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkArr"
        default-expand-all
        show-checkbox
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      treelist: [],
      dialogFormVisible: false,
      checkArr: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      currRoleId: -1,
      loading:true
    };
  },
  created() {
    this.getRolesTable();
  },
  methods: {
    fn1(row,expandedRows){
      if(expandedRows.length>1){
        expandedRows.shift()
      }
      // console.log(row);
      // console.log(expandedRows);
      
    },
    async setRights() {
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr1);
      
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      //  console.log(arr2);
      const arr = [...arr1, ...arr2];
      //  console.log(arr);
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res);
      
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.dialogFormVisible = false;
        this.getRolesTable();
        this.$message.success(msg)
      }
    },
    async showDiaSetRights(role) {
      this.currRoleId = role.id
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.treelist = data;
        const temp = [];
        role.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 => {
              temp.push(item3.id);
            });
          });
        });
        this.checkArr = temp;
        this.dialogFormVisible = true;
      }
    },
    async deltag(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
    },
    showRole() {},
    async getRolesTable() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
        this.loading = false
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
.level1,
level2 {
  margin-bottom: 10px;
}
</style>
