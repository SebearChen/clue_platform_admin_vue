<template>
  <div class="createPost-container" :is-edit="false">
    <el-row>
      <sticky :class-name="'sub-navbar '" style="background: #eef1f6;">
        <el-col :span="12" align="left" style="padding-left: 60px;"> {{ pageName }} </el-col>
        <el-button type="info" size="small" @click="$router.go(-1)"> <i class="el-icon-back" /> </el-button>
      </sticky>
    </el-row>
    <div class="createPost-main-container">
      <div class="postInfo-container">
        <el-row>
          <el-col :span="12">
            <strong>线索id: </strong>
            <em>{{postForm.id}}</em>
          </el-col>
          <el-col :span="12">
            <strong>IP: </strong>
            <em>{{postForm.ip}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>专题名称: </strong>
            <em>{{postForm.activityName}}</em>
          </el-col>
          <el-col :span="12">
            <strong>经销商: </strong>
            <em>{{postForm.dealer}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>省份: </strong>
            <em>{{postForm.province}}</em>
          </el-col>
          <el-col :span="12">
            <strong>城市: </strong>
            <em>{{postForm.city}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>客户姓名: </strong>
            <em>{{postForm.name}}</em>
          </el-col>
          <el-col :span="12">
            <strong>客户手机: </strong>
            <em>{{postForm.phone}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>性别: </strong>
            <em>{{postForm.gender | formatGender()}}</em>
          </el-col>
          <el-col :span="12">
            <strong>同步信息: </strong>
            <em>{{postForm.syncMsg}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>车系: </strong>
            <em>{{postForm.serial}}</em>
          </el-col>
          <el-col :span="12">
            <strong>车型: </strong>
            <em>{{postForm.model}}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>同步状态: </strong>
            <em>{{statusOpts[postForm.syncStatus]}}</em>
          </el-col>
          <el-col :span="12">
            <strong>创建时间: </strong>
            <em>{{ postForm.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</em>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <strong>同步时间: </strong>
            <em>{{postForm.syncTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</em>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

import { getEnrollOne } from '@/api/clue'

const statusOpts = {
  "0": '未同步',
  "1": '同步中',
  "2": '同步成功',
  "3": '同步失败'
}

const defaultForm = {
  activityName: '',
  city: '',
  createTime: '',
  dealer: '',
  gender: '',
  id: '',	
  ip: '',
  model: '',
  name: '',
  params: '',
  phone: '',
  province: '',
  serial: '',
  syncMsg: '',
  syncStatus: '',
  syncTime: '',
}

export default {
  name: 'ClueDetail',
  components: {Sticky},

  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      statusOpts
    }
  },
  computed: {
    pageName() {
      let name = this.$route.meta.module + '详情'
      if (this.id) {
        name += ` - ${this.id}`
      }
      if (this.isNew) {
        return name + ' - 创建'
      }
      return name
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
    fetchData() {
      if (!this.id) {
        return
      }
      this.loading = true
      getEnrollOne(this.id).then(response => {
        this.postForm = response.data
        this.postForm.roles = this.postForm.roles.map(x => x.id)
        console.log('>>> postForm: ' + JSON.stringify(this.postForm))
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.postInfo-container {
  .el-row {
    margin-top: 20px;
  }
  .el-col {
    padding: 0 20px;
    strong {
      font-size: 16px;
      color: #999999;
    }
    em {
      font-size: 16px;
      color: #000000;
    }
  }
}


</style>
