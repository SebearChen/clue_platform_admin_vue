<template>
  <div class="addConfigPost-container" :is-edit="false">
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
      <div class="addConfigPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item prop="id" class="form-items" required>
                <MDinput v-model="postForm.id" :maxlength="80" name="id" v-if="isReadonly" :disabled="isReadonly"> ID </MDinput>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item prop="configGroup" class="form-items" required>
                <MDinput v-model="postForm.configGroup" :maxlength="80" name="configGroup" :disabled="isReadonly"> 配置组 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="configKey" class="form-items" required>
                <MDinput v-model="postForm.configKey" :maxlength="80" name="configKey" :disabled="isReadonly"> 配置键 </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="configValue" class="form-items" required>
                <MDinput v-model="postForm.configValue" :maxlength="80" name="configValue" :disabled="isReadonly"> 配置值 </MDinput>
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item prop="configDesc" class="form-items" required>
                <MDinput v-model="postForm.configDesc" :maxlength="80" name="configDesc" :disabled="isReadonly"> 描述 </MDinput>
              </el-form-item>
            </el-col>    
          </el-row>
          <el-row>  
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
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

import { getConfigOne, updateConfig, addConfig } from '@/api/system/configuration'

import store from '@/store'
import { hex_md5 } from '@/utils/md5'

const defaultForm = {
  configDesc: '',
	configGroup: '',
	configKey: '',
	configValue: '',
	status: 1
}

export default {
  name: 'configurationDetail',
  components: { MDinput, Sticky },
  filters: { },
  props: { },

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
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
      // parents: [],
      id: undefined,
      isNew: isNew,
      readonly: readonly,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        configDesc: [{ validator: validateRequire }],
        configGroup: [{ validator: validateRequire }],
        configKey: [{ validator: validateRequire }],
        configValue: [{ validator: validateRequire }],
        // id: [{ validator: validateRequire }],
        status: [{ validator: validateRequire }]
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
  },

  methods: {

    // handleChange(value){
    //   let user = JSON.parse(value);
    //   this.postForm.id = user[0];
    //   this.postForm.loginName = user[1];
    //   this.postForm.realName = user[2];
    // },

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
      getConfigOne(this.id).then(response => {
        this.postForm = response.data
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
          const form = this.postForm 
          const saveFunc = this.isNew ? addConfig : updateConfig                                                                                                                                                                                                                                                                     
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

.addConfigPost-container {
  position: relative;

  .addConfigPost-main-container {
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
