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
                <MDinput v-model="postForm.name" :maxlength="80" name="name" :disabled="isReadonly"> 商户名称 </MDinput>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item prop="brandId" class="form-items" required>
                <MDinput v-model="postForm.brandId" type="number" :maxlength="80" name="brandId" :disabled="isReadonly"> 品牌ID </MDinput>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="brandName" class="form-items" required>
                <MDinput v-model="postForm.brandName" :maxlength="80" name="brandName" :disabled="isReadonly"> 品牌名称 </MDinput>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item prop="mfId" class="form-items" required>
                <MDinput v-model="postForm.mfId" type="number" :maxlength="80" name="mfId" :disabled="isReadonly"> 厂商ID </MDinput>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="mfName" class="form-items" required>
                <MDinput v-model="postForm.mfName" :maxlength="80" name="mfName" :disabled="isReadonly"> 厂商名称 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="remark" class="form-items" label="备注">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 20}"
                  :disabled="isReadonly"
                  placeholder="请输入内容"
                  v-model="postForm.remark">
                </el-input>
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
import Sticky from '@/components/Sticky' // 粘性header组件

import { getOneFirm, createFirm, updateFirm } from '@/api/business'
import store from '@/store'
import { hex_md5 } from '@/utils/md5'

const defaultForm = {
  name: '',
  brandId: '',
  brandName: '',
  mfId: '',
  mfName: '',
  remark: ''
}

export default {
  name: 'BusinessDetail',
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
  },
  methods: {
    onReset() {
      if (this.readonly) {
        return
      }
      this.postForm = Object.assign({}, defaultForm)
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
      getOneFirm(this.id).then(response => {
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
          const saveFunc = this.isNew ? createFirm : updateFirm
  
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
