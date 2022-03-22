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
                <MDinput v-model="postForm.name" :maxlength="80" name="name" :disabled="isReadonly"> 角色名称 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="description" class="form-items" required>
                <MDinput v-model="postForm.description" :maxlength="80" name="description" :disabled="isReadonly"> 介绍 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item prop="status" class="form-items" label="状态">
                <el-switch
                  v-model="postForm.status"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :disabled="isReadonly"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="roleMenus" class="form-items">
                <el-tree
                   v-model="postForm.roleMenus"
                  :data="menus"
                   show-checkbox
                   node-key="id"
                   ref="tree"
                   default-expand-all
                  :default-checked-keys="roleMenus"
                  :props="defaultProps">
                </el-tree>
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

import { getOne, update, create } from '@/api/system/role'
import { getList } from '@/api/system/menu'
import store from '@/store'
import { hex_md5 } from '@/utils/md5'

const defaultForm = {
  url: '',
  description: '',
  name: '',
  permitKey: '',
  id: undefined,
  status: 1,
  parentId: undefined,
  roleMenus:[]
}

export default {
  name: 'MenuDetail',
  components: { MDinput, Sticky },
  filters: { },
  props: { },

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //   // message: rule.field + '为必传项',
        //   message: '必填项',
        //   type: 'error'
        // })
        callback(new Error('必填项'))
      } else {
        callback()
      }
    } // validateRequire()

    let readonly = true
    let isNew = false
    if (this.$route.meta.crud && this.$route.meta.crud === 'c') {
      readonly = false
      isNew = true
    }

    return {
      parents: [],
      id: undefined,
      isNew: isNew,
      readonly: readonly,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [{ validator: validateRequire }],
        permitKey: [{ validator: validateRequire }],
        url: [{ validator: validateRequire }],
        description: [{ validator: validateRequire }]
      },
      tempRoute: {},
      roleMenus: [],
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    pageName() {
      let name = this.$route.meta.module + '详情'
      if (this.id) {
        name += ` - ${this.id}`
      }
      if (this.isNew) {
        // return '添加-' + this.$route.meta.module
        this.postForm = []
        return name + ' - 创建'
      }
      return name
    },

    isReadonly() {
      return this.readonly
    },
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    }
  }, // computed()

  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.id = id
      this.fetchData()
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewname function, this.$route is no longer pointing to the current page
    this.tempRoute = Object.assign({}, this.$route)

    // 初始化菜单列表
      getList().then(response => {                              
        this.menus = response.data
      }).catch(err => {
        console.log(err)
      })
  },

  methods: {
    onReset() {
      if (this.readonly) {
        return
      }
      this.postForm = Object.assign({}, defaultForm)
    }, // onReset()

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
        this.roleMenus = this.postForm.roleMenus
        console.log('>>> postForm: ',  this.roleMenus)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    }, // fetchData()

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
          this.postForm.roleMenus = this.$refs.tree.getCheckedKeys();
          const form = { ...this.postForm }
          this.loading = true
          const saveFunc = this.isNew ? create : update      
          saveFunc(form).then(res => {
            this.toast(true, res.msg)
            this.readonly = true
            if (this.isNew) {
              this.id = res.data.id
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
    } // onSave()
  } // methods()
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
