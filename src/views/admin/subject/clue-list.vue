<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="12" align="left" class="small-padding">
          <strong style="line-height: 33px; color: #666666"
            >【线索列表】{{ $route.query.name }} <em style="color: red;font-sytle: normal;font-size: 14px;">专题ID： {{$route.params.id}}</em></strong
          >
          <!-- - {{activityId}} -->
        </el-col>
        <el-col :span="12" align="right" class="small-padding">
          <el-button type="info" size="small" @click="$router.go(-1)" circle>
            <i class="el-icon-back" />  
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-mg">
        <el-col :span="24" align="left" class="small-padding">
          <!-- <el-input v-model="listQuery.activityId" placeholder="专题ID" style="width: 180px;" class="filter-item" />
          &nbsp;-->
          <el-input
            v-model="listQuery.activityName"
            placeholder="专题名称"
            style="width: 180px"
            class="filter-item"
            clearable
            @keypress.native.enter="handleFilter"
          />&nbsp;
          <el-input
            v-model="listQuery.name"
            placeholder="客户姓名"
            style="width: 180px"
            class="filter-item"
            clearable
            @keypress.native.enter="handleFilter"
          />&nbsp;
          <el-input
            v-model="listQuery.phone"
            placeholder="客户手机号"
            style="width: 180px"
            class="filter-item"
            clearable
            @keypress.native.enter="handleFilter"
          />&nbsp;
           <el-date-picker
            v-model="createValue"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>&nbsp;
          <el-date-picker
            v-model="synValue"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="同步开始时间"
            end-placeholder="同步结束时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>&nbsp;
          <el-select
            v-model="listQuery.syncStatus"
            placeholder="同步状态"
            clearable
            class="filter-item"
            style="width: 130px"
          >
          <el-option
            v-for="k in statusOptList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          /> </el-select
          >&nbsp;
          <el-select
            v-model="listQuery.valid"
            placeholder="线索状态"
            clearable
            class="filter-item"
            style="width: 130px"
          >
          <el-option
            v-for="k in statusValidList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          /> </el-select
          >&nbsp;
          <el-select
            v-model="listQuery.status"
            placeholder="审核状态"
            clearable
            class="filter-item"
            style="width: 130px"
          >
          <el-option
            v-for="k in statusOsList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          /> </el-select
          >&nbsp;
          <el-select
            v-model="listQuery.type"
            placeholder="线索来源"
            clearable
            class="filter-item"
            style="width: 130px"
          >
          <el-option
            v-for="k in typeList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          /> </el-select
          >&nbsp;
          <el-button
            style="margin-left: 10px; padding-bottom: 10px"
            icon="el-icon-search"
            circle
            @click="handleFilter"
          />&nbsp;
          <el-button
            style="margin-left: 10px; padding-bottom: 10px"
            icon="el-icon-refresh-left"
            circle
            @click="resetFilter"
          />
        </el-col>
      </el-row>
      <el-row class="row-mg">
        <el-col :span="12" align="left" class="small-padding">
          <el-button type="primary" size="small" @click="activityDownload"
            >下载模板</el-button
          >
          <el-button class="uploat-file--p" type="primary" size="small">
            <input
              class="uploat-file"
              type="file"
              @change="getFile"
              multiple="multiple"
            />
            导入线索
          </el-button>
          <el-button type="primary" size="small" @click="enrollExport"
            >导出线索</el-button
          >
          <el-button type="danger" size="small" @click="initSyncStatus"
            >重推失败线索</el-button
          >
        </el-col>
        <el-col :span="12" align="right" class="small-padding">
          <el-button
            type="primary"
            size="small"
            @click="dialogFormVisible = true"
            >批量审核</el-button
          >
          <el-button type="primary" size="small" @click="onBatchDelete"
            >批量删除</el-button
          >
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      height="400"
      size="small"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column width="70" label="线索ID" prop="id" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id || "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="客户手机" align="center" width="100">
        <template slot-scope="{ row }"><span>{{ row.phone || "-" }}</span></template>
      </el-table-column>

      <el-table-column label="客户姓名" class-name="status-col">
        <template slot-scope="{ row }"><span class="textWidth">{{ row.name || "-" }}</span></template>
      </el-table-column>
      <el-table-column label="性别" width="50" class-name="status-col">
        <template slot-scope="{ row }">{{
          row.gender | formatGender()
        }}</template>
      </el-table-column>
      <el-table-column label="地区" align="center">
        <template slot-scope="{ row }"
          ><span class="textWidth">{{ row.province || "-" }} / {{ row.city || "-" }}</span></template
        >
      </el-table-column>
      <el-table-column label="经销商" align="center">
        <template slot-scope="{ row }">
          <span class="textWidth">{{ row.dealer || "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="车系" align="center">
        <template slot-scope="{ row }">
          <span class="textWidth">{{ row.serial || "-" }}</span>
        </template>
      </el-table-column>


      <el-table-column label="车型" align="center">
        <template slot-scope="{ row }"><span class="textWidth">{{ row.model || "-" }}</span></template>
      </el-table-column>

      <el-table-column label="线索来源" align="center">
        <template slot-scope="{row}">
         <span class="textWidth">{{ typeValid[row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="扩展参数" align="center" v-if="tag">
        <template slot-scope="{ row }">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.params"
          >
            <p class="row-str--ellipsis" slot="reference">
              <span class="textWidth">{{ row.params || "-" }}</span>
            </p>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="ip" align="center">
        <template slot-scope="{ row }"><span class="textWidth">{{ row.ip || "-" }}</span></template>
      </el-table-column>
      <el-table-column label="同步信息" align="center">
        <template slot-scope="{ row }">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.syncMsg"
          >
            <p class="row-str--ellipsis" slot="reference">
             <span class="textWidth"> {{ row.syncMsg || "-" }}</span>
            </p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="同步时间" width="160" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.syncTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线索状态" align="center">
        <template slot-scope="{ row }">
          <span :class="[row.valid ? '': 'validTag']" v-if="row.valid != 3">
            {{statusValids[row.valid] || "-"}}
          </span>
          <span v-else>
            <el-tag type="danger">黑名单</el-tag>
          </span>
         </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="{ row }">{{
          statusOs[row.status] || "-"
        }}</template>
      </el-table-column>
      <el-table-column label="同步状态" align="center">
        <template slot-scope="{ row }">{{
          statusOpts[row.syncStatus] || "-"
        }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="$t('table.actions')"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="onDel(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getEnrollLsit"
    />
    <el-dialog
      title="请选择审核状态"
      width="30%"
      center
      :visible.sync="dialogFormVisible"
    >
      <el-form style="text-align: center">
        <el-radio v-model="status" label="1">审核通过</el-radio>
        <el-radio v-model="status" label="2">审核不通过</el-radio>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onBatchAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEnrollLsit,
  enrollImport,
  enrollExport,
  del,
  batchDelete,
  batchAudit,
} from "@/api/clue";
import { activityDownload, initSyncStatus } from "@/api/subject";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

const statusOs = {
  0: "未审核",
  1: "通过",
  2: "不通过",
};

const statusOpts = {
  0: "未同步",
  1: "同步中",
  2: "同步成功",
  3: "同步失败",
};

const statusValids = {
  0: "异常",
  1: "有效",
  2: "重复",
  3: "黑名单"
};

const typeValid = {
  0: "用户提交",
  1: "后台导入",
  2: "广告分析系统",
  3: "睿集客"
}

const defaultForm = {
  activityId: "",
  activityName: "",
  name: "",
  page: 1,
  type: '',
  pageSize: 50,
  phone: "",
  source: "",
  syncStatus: "",
  startTime_create: '',
  endTime_create: ''
};

export default {
  name: "ClueList",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = { 1: "success", 0: "info" };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: Object.assign({}, defaultForm),
      statusOs,
      statusOpts,
      statusValids,
      typeValid,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      temp: {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: "",
        email: "",
        activityId: null,
      },
      ids: [],
      dialogFormVisible: false,
      status: "1",
      tag: 1, //  扩展参数列表 0：隐藏 1：显示
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
       createValue: '',
       synValue: ''
    };
  },
  computed: {
    isAdmin() {return this.$store.state.user.isAdmin },
    statusOptList() {
      const arr = [];
      Object.keys(statusOpts).forEach((i) => {
        arr.push({
          id: i,
          value: statusOpts[i],
        });
      });
      return arr;
    },
    statusValidList() {
      const arr = [];
      Object.keys(statusValids).forEach((i) => {
        arr.push({
          id: i,
          value: statusValids[i],
        });
      });
      return arr;
    },
    statusOsList() {
      const arr = [];
      Object.keys(statusOs).forEach((i) => {
        arr.push({
          id: i,
          value: statusOs[i],
        });
      });
      return arr;
    },
    typeList() {
      const arr = [];
      Object.keys(typeValid).forEach((i) => {
        arr.push({
          id: i,
          value: typeValid[i],
        });
      });
      return arr;
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.$route.query.tag ? (this.tag = true) : (this.tag = false);
    if (id) {
      this.activityId = id;
      defaultForm.activityId = id;
      this.listQuery = Object.assign({}, defaultForm);
      this.getEnrollLsit();
    }
  },
  methods: {
    async getEnrollLsit() {
      this.listLoading = true;
      const response = await getEnrollLsit(this.listQuery);
      if (response.code == 200) {
        console.log(response.data.rows)
        this.list = response.data.rows;
        this.total = response.data.total;
      }
      this.listLoading = false;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.listQuery.startTime_create = this.createValue[0];
      this.listQuery.endTime_create = this.createValue[1];
      this.listQuery.startTime_syn = this.synValue[0];
      this.listQuery.endTime_syn = this.synValue[1];
      this.getEnrollLsit();
    },
    resetFilter() {
      this.createValue = ''
      this.createValue = ''
      this.synValue = ''
      this.synValue = ''
      this.listQuery = Object.assign({}, defaultForm);
      this.getEnrollLsit();
    },
    async activityDownload() {
      const { activityId } = this.listQuery;
      const res = await activityDownload({ id: activityId });
      window.open(res, "_blank");
    },
    async initSyncStatus() {
      const { activityId } = this.listQuery;
      const res = await initSyncStatus(activityId);
      let msg = "";
      if (res.code == 200) {
        msg = "success";
      } else {
        msg = "error";
      }
      this.$notify({
        message: msg == "success" ? "重推成功" : "重推失败",
        type: msg,
        duration: 1000,
      });
    },
    async enrollExport() {
      const res = await enrollExport(this.listQuery);

      window.open(res, "_blank");
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
          const res = await enrollImport(formData, this.listQuery.activityId);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "批量上传成功",
            });
            this.getEnrollLsit();
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
    onDel(id) {
      this.$confirm("确定要删除？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del(id)
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getEnrollLsit();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃删除",
          });
        });
    }, // onDel()
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = [];
      val.forEach((item, key) => {
        this.ids.push(item.id);
      });
      // this.ids = this.ids.slice(0, this.ids.length -1 )
    },
    onBatchAudit() {
      if (!this.ids || this.ids.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择线索",
        });
        return;
      }
      this.$confirm("确定要进行批量审核吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchAudit(this.status, this.ids)
            .then(() => {
              this.$message({
                type: "success",
                message: "批量审核成功",
              });
              this.dialogFormVisible = false;
              this.getEnrollLsit();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃审核",
          });
        });
    },
    onBatchDelete() {
      if (!this.ids || this.ids.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择线索",
        });
        return;
      }
      this.$confirm("确定要进行批量删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          batchDelete(this.ids)
            .then(() => {
              this.$message({
                type: "success",
                message: "批量删除成功",
              });
              this.getEnrollLsit();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃删除",
          });
        });
    },
  }
};
</script>

<style lang="scss">
.el-table--small th, .el-table--small td, .el-table--small th, .el-table--small td{
  padding: 2px 0;
  line-height: 1;
}
.el-table .cell{
  line-height: 12px;
}
</style>
