<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      class="form-container"
      :model="postForm"
      :rules="rules"
    >
      <el-row>
        <sticky :class-name="'sub-navbar '" style="background: #eef1f6">
          <el-col :span="12" align="left" style="padding-left: 60px">
            多专题批量导入线索
          </el-col>
          <el-col :span="12" style="padding-right: 72px">
            <el-button type="info" size="small" @click="$router.go(-1)">
              <i class="el-icon-back" />
            </el-button>
          </el-col>
        </sticky>
      </el-row>
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="12" class="form-elCol">
              <el-form-item
                prop="name"
                class="form-items"
                required
                label="商户"
              >
                <el-select
                  v-model="postForm.name"
                  placeholder="请选择商户名"
                  @change="getDockAll"
                >
                  <el-option
                    v-for="item in names"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="form-elCol">
              <el-form-item
                prop="dockId"
                class="form-items"
                required
                label="对接器"
              >
                <el-select v-model="postForm.dockId" placeholder="请选择对接器">
                  <el-option
                    v-for="item in dockIds"
                    :key="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" align="right">
              <el-button type="primary" size="small" @click="activityDownloadBatch"
                >下载模板</el-button>
              <el-button class="uploat-file--p" type="primary" size="small">
                <input
                  class="uploat-file"
                  type="file"
                  @change="getFile"
                  multiple="multiple"
                />
                导入线索
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件

import { getFirmAll } from "@/api/business";
import { getDockAll } from "@/api/abutment";
import store from "@/store";

import { activityDownloadBatch } from "@/api/subject";
import { enrollImport } from "@/api/clue";

export default {
  name: "subjectExport",
  components: { MDinput, Sticky },
  filters: {},
  props: {},

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error",
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };

    return {
      dockIds: [],
      names: [],
      postForm: {},
      rules: {
        name: [{ validator: validateRequire }],
        dockId: [{ validator: validateRequire }],
      },
    };
  },
  computed: {
    
  },
  methods: {
    async getFirmAll() {
      const res = await getFirmAll();
      console.log(res);
      if (res.code == 200) {
        this.names = res.data;
        this.postForm.name = this.names[0]
      }
      this.getDockAll();
    },

    async getDockAll() {
      const res = await getDockAll({ firmId: this.postForm.name });
      const data = res.data;
      this.dockIds = res.data[0].id

    },
    async activityDownloadBatch() {
      this.postForm.dockId = '50'
      const res = await activityDownloadBatch({ dockId: this.postForm.dockId });
      window.open(res, "_blank");
      window.location.href = res;
    },
    async getFile(e) {
      console.log(e.target.files);
      const _file = e.target.files[0];
      console.log(_file);
      const fileName = _file.name;
      e.target.value = null;
      let formData = new FormData();
      formData.append("file", _file);
      this.$confirm(`确定要批量导入${fileName}？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await enrollImport(formData, this.postForm.dockId);
          if (res.code == 200) {
            this.getFirmAll();
          } else {
            this.$message({
              type: "danger",
              message: "请重新批量上传",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃批量上传",
          });
        });
    },
  },
  mounted() {
    this.getFirmAll();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.form-items {
  margin-right: 40px;
  padding-left: 10px;
  padding-right: 10px;
}

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 10px 45px 10px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.form-elCol {
  margin-right: 4%;
}
</style>