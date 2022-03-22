<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="24" align="left" class="small-padding">
          <el-input
            v-model="listQuery.activityId"
            placeholder="专题ID"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.activityName"
            placeholder="专题名称"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            value-format="timestamp"
            placeholder="开始时间"
            align="right"
            size="small"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          &nbsp;
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            value-format="timestamp"
            placeholder="结束时间"
            align="right"
            size="small"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
            &nbsp;
           <el-select
            v-model="listQuery.status"
            placeholder="专题状态"
            clearable
            class="filter-item"
            style="width: 130px"
            size="small"
            @change="handleFilter"
          >
          <el-option
            v-for="k in statusOptList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          />
          </el-select>
          &nbsp;
          <el-button
            size="small"
            style="margin-left: 10px; padding-bottom: 10px"
            icon="el-icon-search"
            circle
            @click="handleFilter"
          />
          &nbsp;
          <el-button
            size="small"
            style="margin-left: 10px; padding-bottom: 10px"
            icon="el-icon-refresh-left"
            circle
            @click="resetFilter"
          />
        </el-col>
      </el-row>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      stripe
      height="540"
      size="small"
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'totalCount', order:'ascending'}"
      @sort-change="changeTableSort"
    >
      <el-table-column  label="专题ID" width="60" align="center" :sortable="'custom'" prop="activityId">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.activityId || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="专题状态" align="center" prop="status">
        <template slot-scope="{ row }">
          <el-tag type="warning" v-if="row.status == 1">未开始</el-tag>
          <el-tag type="success" v-if="row.status == 2">进行中</el-tag>
          <el-tag type="info" v-if="row.status == 3">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="专题" align="center" :sortable="'custom'" prop="activityName">
        <template slot-scope="{ row }">
          <span :class="['textWidth', row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.activityName || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="商户" width="120" align="center" :sortable="'custom'" prop="firm">
        <template slot-scope="{ row }">
          <span :class="['textWidth',row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.firm || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累积线索" width="110" align="center" :sortable="'custom'" prop="totalCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.totalCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待处理异常" width="110" align="center" :sortable="'custom'" prop="toAuditErrCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.toAuditErrCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="黑名单" width="110" align="center" :sortable="'custom'" prop="toAuditErrCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.blackCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步成功" width="110" align="center" :sortable="'custom'" prop="syncSuccessCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.syncSuccessCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步失败" width="110" align="center" :sortable="'custom'" prop="syncFailCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.syncFailCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步中" width="90" align="center">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.synIngCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待同步" width="120" align="center" :sortable="'custom'" prop="syncWaitingCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.syncWaitingCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户提交" width="120" align="center" :sortable="'custom'" prop="submitCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.submitCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="后台导入" width="120" align="center" :sortable="'custom'" prop="importCount">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.importCount || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.follower || "-"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开始时间" width="160" align="center">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.startTime | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="160" align="center">
        <template slot-scope="{ row }">
          <span :class="[row.toAuditErrCount > 0 ? 'validTag' : '']">{{
            row.endTime | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        :label="$t('table.actions')"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <router-link
            :to="{
              path: `/subject/clue-list/${row.activityId}`,
              query: { name: row.activityName },
            }"
          >
            <el-button type="primary" size="mini">查看数据</el-button>
          </router-link>
          &nbsp; &nbsp;
          <el-button size="mini" type="primary" @click="skipUrl(row)">
            查看专题
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList, getDashOrder } from "@/api/dashboard";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const projectOpts = {
  0: "未知",
  1: "未开始",
  2: "进行中",
  3: "已结束",
};

export default {
  name: "BusinessList",
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        activityId: "",
        activityName: "",
        endTime: "",
        page: 1,
        pageSize: 50,
        startTime: "",
        order: '',
        orderType: '',
        status: ''
      },
      tempQuery: {
        activityId: "",
        activityName: "",
        endTime: "",
        page: 1,
        pageSize: 50,
        startTime: "",
        order: '',
        orderType: '',
        status: ''
      },
      projectOpts,
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
  created() {
    this.getList();
  },
  computed: {
    statusOptList() {
      const arr = [];
      Object.keys(projectOpts).forEach((i) => {
        arr.push({
          id: i,
          value: projectOpts[i],
        });
      });
      return arr;
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery)
        .then((response) => {
          this.list = response.data.rows;
          this.total = response.data.total;

          this.listLoading = false;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.tempQuery = this.listQuery;
      this.getList();
      console.log(this.tempQuery)
    },
    resetFilter() {
      this.listQuery = {
        activityId: "",
        activityName: "",
        endTime: "",
        page: 1,
        pageSize: 50,
        startTime: "",
        order: '',
        orderType: ''
      };
      this.getList();
    },
    onDel(id, name) {
      this.$confirm(`确定要删除 ${name}？`, "警告", {
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
              this.getList();
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
    skipUrl(row) {
      window.open(row.link, "_blank");
    },
    changeTableSort(column){
      this.listQuery.order = column.prop
      this.listQuery.orderType = 0
      if(column.order == 'descending') {
        this.listQuery.orderType = 1
      }
      this.getList()
    }
  },
};
</script>

<style lang="scss" scoped>
.validTag {
  color: red;
}
</style>
