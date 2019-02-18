<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <el-table :data="list" height="450" stripe border style="width: 100%" class="rightstable">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <template :slot-scope="list">
        <el-table-column prop="level" label="层级"></el-table-column>
      </template>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
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
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
