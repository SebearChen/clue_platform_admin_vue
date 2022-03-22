<template>
  <div class="createPost-container">
    <el-form  class="form-container"
    >
      <el-row>
        <sticky :class-name="'sub-navbar '" style="background: #eef1f6">
          <el-col :span="12" align="left" style="padding-left: 60px">
            批量操作
          </el-col>
          <el-col :span="12" style="padding-right: 72px">
            <el-button
              :disabled="disabled"
              class="pan-btn-min light-blue-btn"
              style="margin-left: 10px"
              size="small"
              @click="activityDownloadTemp"
            >
              下载模板
            </el-button>
            <el-button
              :disabled="exportDisabled"
              class="uploat-file--p pan-btn-min light-blue-btn"
              size="small"
              >
              <input
                v-show="!exportDisabled"
                class="uploat-file"
                type="file"
                @change="getFile"
                multiple="multiple"
              />
              导入线索
            </el-button>
            <el-button
              :disabled="disabled"
              class="pan-btn-min light-blue-btn"
              style="margin-left: 10px"
              size="small"
              native-type="button"
              @click="enrollExport"
            >
              导出线索
            </el-button>
          </el-col>
        </sticky>
      </el-row>
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="12">
                <el-form-item prop="firm" class="form-items" label="商户">
                    <el-select
                      v-model="firm"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择商户"
                      @click.native="fetchFirmAll"
                      @change="fetchOne(firm)"
                    >
                      <el-option
                        v-for="item in frimList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      {{ item.name }}
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
                <el-form-item prop="dock" class="form-items" label="对接器">
                    <el-select
                      v-model="dock"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择对接器"
                      @click.native="fetchDock"
                      @change="fetchOne(dock)"
                    >
                      <el-option
                        v-for="item in dockList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      {{ item.name }}
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
                <el-form-item prop="activity" class="form-items" label="专题">
                    <el-select
                      v-model="activity"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择专题"
                      @click.native="fetchActivity"
                    >
                      <el-option
                        v-for="item in activityList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                     {{ item.name }} | id:{{ item.id }}
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="id" class="form-items" label="已选id：">
                <div>{{activity.join(';')}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="createValue" class="form-items" label="创建时间">
              <el-date-picker
                v-model="createValue"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="创建开始时间"
                end-placeholder="创建结束时间"
                :picker-options="pickerOptions"
              >
              {{createValue}}
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="synValue" class="form-items" label="同步时间">
              <el-date-picker
                v-model="synValue"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="同步开始时间"
                end-placeholder="同步结束时间"
                :picker-options="pickerOptions"
              >
              {{synValue}}
              </el-date-picker>
            </el-form-item>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getFirmAll,
  getDock,
  getActivity,
  getDownload,
  batchExport
} from '@/api/batch';
import { activityDownload } from "@/api/subject";
import {
  enrollImport
} from "@/api/clue";
import Sticky from '@/components/Sticky' // 粘性header组件
const defaultForm = {
  
};

export default {
  name: "batch",
  components: {Sticky},
  filters: {},
  props: {},

  data() {
    return {
      frimList: [],
      dockList: [],
      activityList: [],
      firm: '',
      dock: '',
      activity: [],
      options: [],
      loading: false,
      states: [],
      disabled: true,
      seaching: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
         text: '最近三个月',
         onClick(picker) {
           const end = new Date();
           const start = new Date();
           start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
           picker.$emit('pick', [start, end]);
         }
       }]
      },
      createValue: null,
      synValue: null,
      exportDisabled: true // 导入按钮显示
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    },
    lang() {
      return this.$store.getters.language;
    },
  },
  watch: {
    firm (val) {
      if(val && this.seaching){
        this.seaching = false;
        this.judgeDisable()
        this.fetchFirmAll()
      }
      this.seaching = true;
    },
    dock (val) {
      if(val && this.seaching){
        this.seaching = false;
        this.judgeDisable()
        this.fetchDock()
      }
      this.seaching = true;
    },
    activity(val) {
      if(val && this.seaching){
        this.seaching = false;
        this.judgeDisable()
        this.fetchActivity()
      }
      this.seaching = true;
    },
    createValue(val){
      this.exportDisabled = val || this.synValue? true:false
    },
    synValue(val){
      this.exportDisabled = val || this.createValue? true:false
    }
  },
  mounted(){},
  methods: {
    judgeDisable() {
      if(this.firm&&this.dock&&this.activity[0]) {
        this.disabled = false
        this.exportDisabled = false
      }else {
        this.disabled = true
      }
    },
    async fetchFirmAll(){
      let res = await getFirmAll();
      if(res.code == 200){
        this.frimList = res.data;
      } else{
        this.$message({
          type: "danger",
          message: res.message,
        });
      }
    },
    async fetchDock(){
      let res = await getDock(this.firm?this.firm.toString():-1);
      if(res.code == 200){
        this.dockList = res.data
      } else{
         this.$message({
          type: "danger",
          message: res.message,
        });
      }
    },
    async fetchActivity(){
      let params = {
        firmId: this.firm.toString(),
        dockId: this.dock.toString()
      }
      let res = await getActivity(params);
      console.log(res)
      if(res.code == 200) {
        this.activityList = res.data
      }else {
        console.warn(res)
      }
    },
    async activityDownloadTemp(){
      let res = await activityDownload({id: this.activity[0]}).catch(e=>console.warn(e));
      if(res) {
        window.open(res, "_blank");
      }
    },
    fetchOne(item){
      if(item.length>1){
         this.$message({
          type: "error",
          message: "只能选择一个",
        });
      }
    },
    async getFile(e) {
      const _file = e.target.files[0];
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
          const res = await enrollImport(formData, this.activity.join(','));
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "批量上传成功",
            });
            
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
    async enrollExport() {
      let startTime_create = '';
      let endTime_create = '';
      let startTime_syn = '';
      let endTime_syn = '';
      if(this.createValue) {
        startTime_create = this.createValue[0];
        endTime_create = this.createValue[1];
      }
      if(this.synValue){
        startTime_syn =  this.synValue[0];
        endTime_syn =  this.synValue[1];
      }
      const res = await batchExport({ 
        activityIds: this.activity.join(','),
        startTime_create: startTime_create,
        endTime_create: endTime_create,
        startTime_syn: startTime_syn,
        endTime_syn: endTime_syn,
      })
      .catch(e=>{ console.warn(e) });
      if(res) {
        window.open(res, "_blank");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 10px 45px 10px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .checkBox{
        padding-left: 10px;
      }
    }
  }
}
</style>
