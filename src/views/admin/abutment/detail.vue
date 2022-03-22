<template>
  <div class="createPost-container" :is-edit="false">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-row>
        <sticky :class-name="'sub-navbar '" style="background: #eef1f6;">
          <el-col :span="12" align="left" style="padding-left: 60px;"> {{ pageName }} </el-col>
          <el-col :span="12" style="padding-right:72px;">
            <el-button type="info" size="small" @click="$router.go(-1)"> <i class="el-icon-back" /> </el-button>
            <el-button v-if="!isReadonly" v-loading="loading" class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="success" size="small" @click="onSave"> 保存 </el-button>
            <el-button v-if="!isReadonly && !isNew" v-loading="loading" class="pan-btn-min yellow-btn" style="margin-left: 10px;" type="warning" size="small" @click="onCancel"> 返回 </el-button>
            <el-button v-if="isNew && !isReadonly" v-loading="loading" class="pan-btn-min yellow-btn" style="margin-left: 10px;" type="warning" size="small" @click="onReset"> 重置 </el-button>
            <el-button v-if="!isNew && isReadonly" v-loading="loading" class="pan-btn-min green-btn" style="margin-left: 10px;" type="primary" size="small" @click="onEdit"> 编辑 </el-button>
          </el-col>
        </sticky>
      </el-row>
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" class="form-items" required>
                <MDinput v-model="postForm.name" :maxlength="80" name="name" :disabled="isReadonly"> 对接器名称 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="firmId" class="form-items form-item--mg" label="请选择商户">
                <el-select v-model="postForm.firmId" placeholder="请选择商户" :disabled="isReadonly">
                  <el-option
                    v-for="item in firms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="dockKey" class="form-items" required>
                <MDinput v-model="postForm.dockKey" :maxlength="80" name="dockKey" :disabled="isReadonly"> 对接器标识 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="follower" class="form-items" required>
                <MDinput v-model="postForm.follower" :maxlength="80" name="follower" :disabled="isReadonly"> 对接人 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="paramsKeys" class="form-items">
                <MDinput v-model="postForm.paramsKeys" :maxlength="80" name="paramsKeys" :disabled="isReadonly"> 扩展参数Keys </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="paramsNames" class="form-items">
                <MDinput v-model="postForm.paramsNames" :maxlength="80" name="paramsNames" :disabled="isReadonly"> 扩展参Names </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="docUrl" class="form-items" required>
                <MDinput v-model="postForm.docUrl" :maxlength="80" name="docUrl" :disabled="isReadonly"> 对接文档 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import { getFirmAll } from '@/api/business'

import { getOne, create, update } from '@/api/abutment'
import store from '@/store'

const defaultForm = {
	docUrl: "",
	firmId: '',
	follower: "",
	dockKey: "",
  name: "",
  paramsKeys: '',
  paramsNames: '',
}

export default {
  name: 'AbutmentDetail',
  components: { MDinput, Sticky },
  filters: { },
  props: { },

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }

    let readonly = true
    let isNew = false
    if (this.$route.meta.crud && this.$route.meta.crud === 'c') {
      console.log(this.$route.meta.crud)
      readonly = false
      isNew = true
    }

    return {
      roleOpts: store.getters.usr.roleToSel,
      id: undefined,
      isNew: isNew,
      readonly: readonly,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [{ validator: validateRequire }],
        passwd: [{ validator: validateRequire }],
        mobile: [{ validator: validateRequire }],
        roles: [{ validator: validateRequire }],
        email: [{ validator: validateRequire }]
      },
      firms: []
    }
  },
  computed: {
    pageName() {
      let name = this.$route.meta.module + '详情'
      if (this.id) {
        name += ` - ${this.id}`
      }
      if (this.isNew) {
        this.postForm = []
        return name + ' - 创建'
      }
      return name
    },

    isReadonly() {
      return this.readonly
    }
  },

  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.id = id
      this.fetchData()
    }
    this.getFirmAll()
  },
  methods: {
    onReset() {
      if (this.readonly) {
        return
      }
      this.postForm = Object.assign({}, defaultForm)
    },
    async getFirmAll() {
      this.loading = true
      const res = await getFirmAll()
      console.log(res)
      if(res.code == 200) {
        this.firms = res.data
      }
      this.loading = false
    },

    toast(succ, msg = '未知错误') {
      const name = succ ? '成功' : '出错'
      this.$notify({
        name: name,
        message: succ ? '保存成功' : `保存失败：${msg}`,
        type: succ ? 'success' : 'error',
        duration: 1000
      })
    },

    fetchData() {
      if (!this.id) {
        return
      }
      this.loading = true
      getOne(this.id).then(response => {
        this.postForm = response.data
        this.postForm.roles = this.postForm.roles.map(x => x.id)
        console.log('>>> postForm: ' + JSON.stringify(this.postForm))
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },

    onEdit() {
      this.readonly = false
    },

    onCancel() {
      this.readonly = true
    },

    onSave() {
      this.$confirm(`是否确认保存？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.postForm.validate(valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          this.loading = true
          const form = { ...this.postForm }
          const saveFunc = this.isNew ? create : update
          saveFunc(form).then(res => {
            this.toast(true, res.msg)
            this.readonly = true
            if (this.isNew) {
              this.id = res.data?res.data.id:''
              setTimeout(()=> {
                this.$router.go(-1)
              }, 2000)
            } else {
              this.fetchData()
            }
          }).catch(() => {
            this.readonly = false
          }).finally(() => {
            this.loading = false
          })
        })
      })
    }
  }
}
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
</style>
