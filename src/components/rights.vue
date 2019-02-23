<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <el-table :data="list" height="450" stripe border style="width: 100%" class="rightstable" v-loading="loading">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一级</span>
            <span v-if="scope.row.level==='1'">二级</span>
            <span v-if="scope.row.level==='2'">三级</span>
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading:true
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.list = data;
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
.rightstable {
  margin-top: 20px;
}
</style>
