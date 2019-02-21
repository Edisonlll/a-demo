<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
    <el-alert title="注意:只允许给第三级分类设置参数" type="warning" show-icon class="alert"></el-alert>
    <el-form label-position="left" label-width="120px" :model="form" class="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          :options="options"
          expand-trigger="hover"
          clearable
          v-model="selectedOptions"
          @change="handleChange"
          :props="defaultProp"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="1">
        <el-button size="mini" type="primary" disabled>设置动态参数</el-button>
        <el-table :data="arrDT" style="width: 100%" height="300px">
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope>
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button size="mini" type="primary" disabled>设置静态参数</el-button>
        <el-table :data="arrJT" style="width: 100%" height="300px">
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope>
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      form: { attr_vals: "" },
      options: [],
      selectedOptions: [],
      defaultProp: { value: "cat_id", label: "cat_name" },
      arrDT: [],
      arrJT: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    async handleChange() {
      this.getDTorJT();
    },
    async getDTorJT() {
      if (this.selectedOptions.length !== 3) {
        this.$message.error("请先设置第三级分类");
        if (this.active === "1") {
          this.arrDT = [];
        }
        if (this.active === "2") {
          this.arrJT = [];
        }
        return;
      }
      //获取动态数据
      if (this.active === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        // console.log(res);
        if (status === 200) {
          this.arrDT = data;
          this.arrDT.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        }
      }

      //   获取静态数据
      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        console.log(res);
        if (status === 200) {
          this.arrJT = data;
        }
      }
    },
    changeTab() {
        this.getDTorJT()
    },
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
        `,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.el-form-item {
  margin-bottom: 5px;
}
.alert {
  margin: 20px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
