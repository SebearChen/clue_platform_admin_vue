<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input
            v-model="listQuery.deleteTime"
            placeholder="操作员"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.activityId"
            placeholder="专题Id"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.phone"
            placeholder="手机号码"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-date-picker
            v-model="listQuery.startTime_create"
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
            v-model="listQuery.endTime_create"
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

         <el-col :span="6" align="right" class="small-padding">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small" @click="onRecovery()">
              {{ $t('table.recovery') }}
            </el-button>
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
      size="small"
      highlight-current-row
      height="600"
      style="width: 100%;"
      @sort-change="sortChange"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column fixed label="线索ID" prop="id" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
      </el-table-column>

      <el-table-column fixed label="专题ID" align="left">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.activityId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="删除时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deleteTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deleteUser }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.syncStatus | statusFilter">
            {{ row.syncStatus | enabledFilter }}
          </el-tag>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getEnrollRecover, getBatchRecover } from '@/api/clue'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusOpts = [
  { key: '1', display_name: '正常' },
  { key: '0', display_name: '停用' }
]
const statusOptArr = statusOpts.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'recoveryClues',
  components: { Pagination },
  directives: { waves },
  filters: {
    enabledFilter(opt) {
      return statusOptArr[opt]
    },
    statusFilter(syncStatus) {
      const statusMap = { '1': 'success', '0': 'info' }
      return statusMap[syncStatus]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 50,
        name: undefined,
        activityId: '',
        startTime_delete: '',
        endTime_delete: '',
        phone: ''
      },
      statusOpts,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // temp: {
      //   id: undefined,
      //   enabled: 1,
      //   createdAt: new Date(),
      //   name: '',
      //   email: ''
      // },
      ids: [],
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
    }
  },
  created(){
    this.getList()
  },
  // watch:{
  //   '$route'(val){
  //     if(val.name == 'systemUserList')
  //       this.handleFilter()
  //   }
  // },
  methods: {
    async getList() {
      this.listLoading = true
      const response = await getEnrollRecover(this.listQuery)
      if (response.code === 200) {
        this.list = response.data.rows
        this.total = response.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        pageSize: 50,
        name: undefined,
        activityId: '',
        startTime_delete: '',
        endTime_delete: '',
        phone: ''
      };
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     enabled: 1,
    //     createdAt: new Date(),
    //     name: '',
    //     email: ''
    //   }
    // }, // resetTemp()
    handleSelectionChange(val){
      this.ids = []
      val.forEach((item, key) => {
        this.ids.push(item.id);
      });
    },
    onRecovery() {
      if (!this.ids || this.ids.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择要恢复的线索",
        });
        return;
      }
      this.$confirm('确定要恢复吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getBatchRecover(this.ids).then(() => {
          this.$message({
            type: 'success',
            message: '恢复成功'
          })
          this.getList()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃恢复'
        })
      })
    }, // onDel()

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
