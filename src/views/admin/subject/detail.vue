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
                <MDinput v-model="postForm.name" :maxlength="80" name="name" :disabled="isReadonly"> 专题名 </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="form-elCol">
              <el-form-item prop="startTime" class="form-items" required label="开始时间">
                <el-date-picker
                  :disabled="isReadonly"
                  v-model="postForm.startTime"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="开始时间"
                  align="right"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="firmId" class="form-items" label="商户名称">
                <el-select v-model="postForm.firmId" placeholder="请选择商户" :disabled="isReadonly" class="" >
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
              <el-form-item prop="follower" class="form-items" v-if="!multipleFollower">
                <MDinput :value="postForm.follower" :maxlength="80" name="follower" :disabled="isReadonly"> 负责人 </MDinput>
              </el-form-item>
              <el-form-item prop="followers" class="form-items" required label="负责人" v-else>
                    <el-select
                      v-model="postForm.followers"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择负责人"
                      :remote-method="remoteMethod"
                      @click="remoteMethod"
                      :loading="followerLoading"
                    >
                      <el-option
                        v-for="item in followerOptions"
                        :key="item[0]"
                        :label="`${item[0]}|${item[2]}`"
                        :value="`${item[0]}|${item[2]}`"
                      >
                      {{ item[0] }} | {{ item[1] }} | {{ item[2] }}
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4" class="form-elCol">
              <el-form-item prop="endTime" class="form-items" required label="结束时间">
                  <el-date-picker
                    :disabled="isReadonly"
                    v-model="postForm.endTime"
                    type="datetime"
                    value-format="timestamp"
                    placeholder="结束时间"
                    align="right"
                    default-time="23:59:59"
                    :picker-options="pickerOptions">
                  </el-date-picker>
              </el-form-item>
            </el-col>  
            <el-col :span="6">
              <el-form-item prop="isNeedAudit" class="form-items form-item--mg" label="是否审核">
                <el-switch
                  v-model="postForm.isNeedAudit"
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
            <el-col :span="24">
              <el-form-item prop="link" class="form-items" required>
                <MDinput v-model="postForm.link" :maxlength="80" name="link" :disabled="isReadonly" type="text">
                  专题连接
                </MDinput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="description" class="form-items" required label="简介">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 20}"
                  :disabled="isReadonly"
                  placeholder="请输入内容"
                  v-model="postForm.description">
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

import { getOne, update, create } from '@/api/subject'
import { getFirmAll } from '@/api/business'
import { getFollowerList } from '@/api/user'
import store from '@/store'
import { hex_md5 } from '@/utils/md5'

const defaultForm = {
  description: "",
	endTime: "",
	firmId: '',
	link: "",
	name: "",
  startTime: "",
  followers: [],
  userInfoVOS: [],
  follower: '',
  userIds: ''
}

export default {
  name: 'SubjectDetail',
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
        description: [{ validator: validateRequire }],
        endTime: [{ validator: validateRequire }],
        follower: [{ validator: validateRequire }],
        link: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        startTime: [{ validator: validateRequire }],
      },
      tempRoute: {},

      firms: [],
      multipleFollower: false,
      followerOptions: [],
      followerKey: '',
      followerSelect: [],
      followerLoading: false,

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
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
        // return '添加-' + this.$route.meta.module
        this.postForm = {}
        this.multipleFollower = true
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
  watch: {
    "postForm.followers"(val) {
      let _followers = [], _userIds = []
      this.postForm.userInfoVOS = []

      this.postForm.followers.forEach(item => { 
        _followers.push(item.split('|')[1]);
        _userIds.push(item.split('|')[0]);
        this.postForm.userInfoVOS.push({
          id: item.split('|')[0],
          name: item.split('|')[1]
        })
      })
      this.postForm.follower = _followers.join(',')
      this.postForm.userIds = _userIds.join(',')
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.id = id
      this.fetchData()
    }
    this.getFirmAll()
    this.tempRoute = Object.assign({}, this.$route)
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
    async fetchData() {
      this.loading = true

      const res = await getOne(this.id)
      if (res.code == 200) {
        this.postForm = Object.assign({}, defaultForm, res.data)
        console.log(this.postForm)
        let _userInfoVOS = this.postForm.userInfoVOS
        this.postForm.followers = _userInfoVOS.map((item, index)=>{
          return `${item.id}|${item.name}`
        })
        console.log(this.postForm)
      }

      this.loading = false
    },
    async getFirmAll() {
      this.loading = true
      const res = await getFirmAll()
      if(res.code == 200) {
        this.firms = res.data
      }
      this.loading = false
    },

    onEdit() {
      this.readonly = false;
      this.multipleFollower = true
    },

    onCancel() {
      this.readonly = true;
      this.multipleFollower = false;
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
  
          const form = { ...JSON.parse(JSON.stringify(this.postForm)) }
          
          delete form.followers
          console.log('340:', form)
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
              this.multipleFollower = false
              this.fetchData()
            }
          }).catch(() => {
            this.readonly = false
          }).finally(() => {
            this.loading = false
          })
        })
      })
    },
    async getFollowerList(account) {
      this.followerLoading = true
      const res = await getFollowerList({ account })
      if(res.code == 200) {
        this.followerOptions = res.data
      }else {
        console.warn(res)
      }
      this.followerLoading = false
    },
    remoteMethod(data) {
      this.getFollowerList(data)
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
.form-elCol{
  margin-right: 4%;
}
</style>
