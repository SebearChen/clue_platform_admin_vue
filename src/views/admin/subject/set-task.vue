<template>
  <div class="createPost-container" :is-edit="false">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-row>
        <sticky :class-name="'sub-navbar '" style="background: #eef1f6;">
          <el-col :span="12" align="left" style="padding-left: 60px;">{{ pageName }}</el-col>
          <el-col :span="12" style="padding-right:72px;">
            <el-button type="info" size="small" @click="$router.go(-1)">
              <i class="el-icon-back" />
            </el-button>
            <el-button
              v-if="!isReadonly"
              v-loading="loading"
              class="pan-btn-min light-blue-btn"
              style="margin-left: 10px;"
              type="success"
              size="small"
              @click="onSave"
            >保存</el-button>
            <el-button
              v-if="!isReadonly && !isNew"
              v-loading="loading"
              class="pan-btn-min yellow-btn"
              style="margin-left: 10px;"
              type="warning"
              size="small"
              @click="onCancel"
            >返回</el-button>
            <el-button
              v-if="isNew && !isReadonly"
              v-loading="loading"
              class="pan-btn-min yellow-btn"
              style="margin-left: 10px;"
              type="warning"
              size="small"
              @click="onReset"
            >重置</el-button>
            <el-button
              v-if="!isNew && isReadonly"
              v-loading="loading"
              class="pan-btn-min green-btn"
              style="margin-left: 10px;"
              type="primary"
              size="small"
              @click="onEdit"
            >编辑</el-button>
          </el-col>
        </sticky>
      </el-row>
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="dockId" class="form-items form-item--mg" label="对接策略">
                <el-select
                  v-model="postForm.dockId"
                  placeholder="对接器"
                  :disabled="isReadonly"
                >
                  <el-option
                    v-for="item in list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="cycle" class="form-items form-item--mg" label="同步频率">
                <el-select
                  v-model="postForm.cycle"
                  placeholder="同步频率"
                  :disabled="isReadonly"
                >
                  <el-option
                    :disabled="isReadonly"
                    v-for="item in times"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="num" class="form-items form-item--mg" label="单次同步数量">
                <el-input v-model="postForm.num" placeholder="单次同步数量" class="num" :disabled="isReadonly"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="startTime" class="form-items form-item--mg" label="开始时间">
                <el-date-picker
                  :disabled="isReadonly"
                  v-model="postForm.startTime"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="endTime" class="form-items form-item--mg" label="结束时间">
                <el-date-picker
                  :disabled="isReadonly"
                  v-model="postForm.endTime"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择日期时间"
                  align="right"
                  default-time="23:59:59"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="form-item--mg">
            <el-col :span="20">
              <el-form-item prop="params" class="form-items" label="对接参数">
                <json-editor v-if="!isReadonly" placeholder="请输入内容" v-model="postForm.params"></json-editor>
                <div name id cols="30" rows="10" disabled ref="params" v-else>
                  <div class="paramsForm" v-html="paramsValue"></div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="status" class="form-items form-item--mg" label="状态">
                <el-switch
                  :disabled="isReadonly"
                  v-model="postForm.status"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
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
import JsonEditor from "@/components/JsonEditor";

import { getOne, save } from "@/api/set-task";
import { getDockAll } from "@/api/abutment";
import store from "@/store";
import { hex_md5 } from "@/utils/md5";

import { Message } from "element-ui";

const defaultForm = {
  activityId: "",
  cycle: "",
  dockId: "",
  endTime: "",
  nextTime: "",
  params: { key: "pc" },
  startTime: "",
  status: "",
};

export default {
  name: "setTask",
  components: { MDinput, Sticky, JsonEditor },
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

    let readonly = true;
    let isNew = false;
    if (this.$route.meta.crud && this.$route.meta.crud === "c") {
      readonly = false;
      isNew = true;
    }

    return {
      roleOpts: store.getters.usr.roleToSel,
      id: undefined,
      isNew: isNew,
      readonly: readonly,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        description: [{ validator: validateRequire }],
        endTime: [{ validator: validateRequire }],
        follower: [{ validator: validateRequire }],
        link: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        startTime: [{ validator: validateRequire }],
      },
      tempRoute: {},

      list: [],
      times: [
        { key: "10秒", value: 10 },
        { key: "30秒", value: 30 },
        { key: "1分钟", value: 60 },
        { key: "5分钟", value: 300 },
        { key: "10分钟", value: 600 },
        { key: "15分钟", value: 900 },
        { key: "30分钟", value: 1800 },
        { key: "1小时", value: 3600 },
        { key: "2小时", value: 7200 },
        { key: "1天", value: 87480 },
      ],
      num: 20,
      paramsValue: "",

      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  computed: {
    pageName() {
      let name = this.$route.meta.module;
      if (this.id) {
        name += ` - ${this.id}`;
      }
      if (this.isNew) {
        return name + " - 创建";
      }
      return name;
    },

    isReadonly() {
      return this.readonly;
    },
    contentShortLength() {
      return this.postForm.content_short.length;
    },
    lang() {
      return this.$store.getters.language;
    },
  },

  created() {
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      this.id = id;
      this.postForm.activityId = id;
      this.fetchData();
    }
    this.getDockAll();
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    onReset() {
      if (this.readonly) {
        return;
      }
      this.postForm = Object.assign({}, defaultForm);
    },
    toast(succ, msg = "未知错误") {
      const name = succ ? "成功" : "出错";
      this.$notify({
        name: name,
        message: succ ? "保存成功" : `保存失败：${msg}`,
        type: succ ? "success" : "error",
        duration: 1000,
      });
    },

    async fetchData() {
      this.loading = true;

      let { activityId } = this.postForm;

      const res = await getOne({ activityId });
      if (res.code == 200) {
        res.data.params = JSON.parse(res.data.params);
        this.postForm = res.data; 
        var text = res.data.params;
        var result = JSON.stringify(text, null, 4);
        this.paramsValue = "<pre>" + result + "</pre>";
      }

      this.loading = false;
    },
    async getDockAll() {
      this.loading = true;
      const res = await getDockAll();
      if (res.code == 200) {
        this.list = res.data;
      }
      this.loading = false;
    },

    onEdit() {
      this.readonly = false;
    },

    onCancel() {
      this.readonly = true;
    },

    onSave() {
      this.$refs.postForm.validate((valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
        const form = { ...this.postForm };
        try {
          if (typeof form.params == "object")
            form.params = JSON.stringify(form.params);
          if (typeof form.params == "string")
            form.params = JSON.stringify(JSON.parse(form.params));
        } catch (e) {
          Message({
            message: "对接参数有误",
            type: "error",
            duration: 2000,
          });
          return;
        }
        this.loading = true;
        save(form)
          .then((res) => {
            this.toast(true, res.msg);
            this.id = res.data ? res.data.id : "";
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
            this.fetchData();
          })
          .catch(() => {
            this.loading = false;
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
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

.num {
  width: 198px;
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
.paramsForm {
  padding: 0 10px;
  margin-left:6%;
  cursor: not-allowed;
  background-color: #f5f7fa;
  border: 1px solid #dfe4ed;
}
</style>
