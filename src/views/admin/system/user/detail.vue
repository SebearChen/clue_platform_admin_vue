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
            <el-col :span="9">
              <el-select
                v-model="searchAccount.value"
                filterable
                remote
                reserve-keyword
                @change="handleChange"
                placeholder="请输入员工账号"
                :remote-method="remoteMethod"
                :loading="searchAccount.loading"
                :disabled="isReadonly">
                <el-option
                  v-for="item in searchAccount.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>            
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="id" class="form-items" required>
                <MDinput v-model="postForm.id" :maxlength="80" name="id" disabled> 员工ID </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="loginName" class="form-items" required>
                <MDinput v-model="postForm.loginName" :maxlength="80" name="loginName" disabled> 登录名 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="email" class="form-items" required>
                <MDinput v-model="postForm.email" :maxlength="80" name="email" :disabled="isReadonly"> 邮箱 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="realName" class="form-items" required>
                <MDinput v-model="postForm.realName" :maxlength="80" name="realName" disabled> 真实姓名 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> 
            <el-col :span="12">
              <el-form-item prop="department" class="form-items" required>
                <MDinput v-model="postForm.department" :maxlength="80" name="department" :disabled="isReadonly"> 部门 </MDinput>
              </el-form-item>
            </el-col>           
            <el-col :span="12">
              <el-form-item prop="status" class="form-items form-item--mg" label="状态">
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
          </el-row>
          <el-row>
            <el-form-item prop="userRoles" class="form-items" label="角色">
              <el-checkbox-group v-model="postForm.userRoles">
                <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

import { getOne, update, create ,search} from '@/api/system/user'
import { getList} from '@/api/system/role'

import store from '@/store'
import { hex_md5 } from '@/utils/md5'

const defaultForm = {
  id: undefined,
  loginName: '',
  email: '',
  realName:'',
  department:'',
  status: 1,  
  userRoles:[]
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
    }

    let readonly = true
    let isNew = false
    if (this.$route.meta.crud && this.$route.meta.crud === 'c') {
      readonly = false
      isNew = true
    }

    return {
      searchAccount:{
        options: [],
        value: [],
        list: [],
        loading: false        
      },
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
      roles:[],
      tempRoute: {}
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
        this.postForm = Object.assign({}, defaultForm)
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
  },

  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.id = id
      this.fetchData()
    }
    this.tempRoute = Object.assign({}, this.$route)

    // 初始化角色列表
    getList().then(response => {                              
      this.roles = response.data
    }).catch(err => {
      console.log(err)
    })
    
  },

  methods: {

    remoteMethod(query) {
        if (query !== '') {
          this.searchAccount.loading = true;
          search(query).then(response => {
            this.searchAccount.options = response.data.map(v => { return {value: JSON.stringify(v), label:''+v[0]+'   |   '+v[1]+'   |   '+v[2]}})
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.searchAccount.loading = false;
          })
        } else {
          this.searchAccount.options = [];
        }
    },

    handleChange(value){
      let user = JSON.parse(value);
      this.postForm.id = user[0];
      this.postForm.loginName = user[1];
      this.postForm.realName = user[2];
    },

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
      getOne(this.id).then(response => {
        this.postForm = response.data
        console.log(this.postForm)
        this.postForm.roles = this.postForm.roles.map(x => x.id)
        
      }).catch(err => {
        console.warn(err)
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
