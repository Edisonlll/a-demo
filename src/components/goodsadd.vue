<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert title="消息提示的文案" type="info" center show-icon class="alert"></el-alert>
    <el-steps :active="active*1" align-center class="step">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form label-position="top" label-width="80px" :model="form" class="form">
      <el-tabs tab-position="left" v-model="active" class="tabs" @tab-click="changetab()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              expand-trigger="hover"
              clearable
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultProp"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="item1 in arrDT" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="item in arrJT" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="header"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      selectedOptions: [],
      options: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name"
      },
      arrDT: [],
      arrJT: [],
      header: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  components: {
    quillEditor
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");
      const arr1 = this.arrDT.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrJT.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      
      const res = await this.$http.post(`goods`, this.form);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      console.log(res);
      if (status === 201) {
        this.$router.push({
          name: 'goods'
        });
        this.$message.success(msg);
      }else {
        this.$message.error(msg)
      }
    },
    handleRemove(file, fileList) {
      // console.log(file);
      // file.response.data.tmp_path
      const index = this.form.pics.findIndex(item => {
        return item.pics === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
    },
    handleSuccess(response, file, fileList) {
      // console.log(response);
      this.form.pics.push({
        pics: file.response.data.tmp_path
      });
    },
    async changetab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请选择三级分类!");
          return;
        }
      }
      //动态数据
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.arrDT = data;
        this.arrDT.forEach(item => {
          item.attr_vals =
            item.attr_vals.trim().length === 0
              ? []
              : item.attr_vals.trim().split(",");
        });
      }

      //静态数据
      if (this.active === "3") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        // console.log(res);

        if (status === 200) {
          this.arrJT = data;
        }
      }
    },
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
    handleChange() {}
  }
};
</script>

<style scoped>
.box {
  height: 100%;
}
.alert {
  margin: 20px 0;
}
.tabs {
  margin-top: 20px;
}
.form {
  overflow: auto;
  height: 350px;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
