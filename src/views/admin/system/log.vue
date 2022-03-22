<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="24" align="left" class="small-padding">
          <el-input
            v-model="listQuery.content"
            placeholder="日志内容"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.userId"
            placeholder="用户ID"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.userName"
            placeholder="用户姓名"
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
      height="600"
      size="small"
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'totalCount', order:'ascending'}"
    >
      <el-table-column  label="ID" width="60" align="center">
        <template slot-scope="{ row }">
          {{row.id || "-"}}
        </template>
      </el-table-column>
      <el-table-column  label="用户姓名" width="150" align="center">
        <template slot-scope="{ row }">
          {{row.userName || "-"}}
        </template>
      </el-table-column>
      <el-table-column  label="	日志类型" width="150" align="center">
        <template slot-scope="{ row }">
          {{row.type==0?'0:后台日志':'1:前台日志' || "-"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" prop="action">
        <template slot-scope="{ row }">
          {{row.action || "-"}}
        </template>
      </el-table-column>
      <el-table-column label="日志内容" align="center" prop="content">
        <template slot-scope="{ row }">
          {{row.content || "-"}}
        </template>
      </el-table-column>
      <el-table-column label="操作IP" width="120" align="center">
        <template slot-scope="{ row }">
          {{row.ip || "-"}}
        </template>
      </el-table-column>

      <el-table-column label="操作时间" width="160" align="center">
        <template slot-scope="{ row }">
          {{row.createTime | parseTime("{y}-{m}-{d} {h}:{i}")}}
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
import { getList } from "@/api/log";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

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
        content: '',
        endTime: '',
        page: 1,
        pageSize: 50,
        startTime: '',
        userId: '',
        userName: '',
      },
      tempQuery: {
        content: '',
        endTime: '',
        page: 1,
        pageSize: 50,
        startTime: '',
        userId: '',
        userName: '',
      },
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
        id: "",
        name: "",
        page: 1,
        pageSize: 50,
      };
      this.getList();
    }
  },
};
</script>

<style lang="scss" scoped>
.validTag {
  color: red;
}
</style>
