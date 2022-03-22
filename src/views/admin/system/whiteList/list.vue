<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input
            v-model="listQuery.id"
            placeholder="id"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-input
            v-model="listQuery.ip"
            placeholder="ip"
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
          <router-link :to="'/system/whiteList/create'">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small">
              {{ $t('table.add') }}
            </el-button>
          </router-link>
          <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small" @click="onBatchDelete()">
            {{ $t('table.batchDelete') }}
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
      <el-table-column fixed label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
      </el-table-column>

      <el-table-column fixed label="ip" align="left">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime	 | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="onDel(row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getWhitelistAll" />
  </div>
</template>

<script>
import { getWhitelistAll, delWhitelist} from '@/api/system/whitelist'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'whiteList',
  components: { Pagination },
  directives: { waves },
  filters: {
    enabledFilter(opt) {
      return statusOptArr[opt]
    },
    statusFilter(status) {
      const statusMap = { '1': 'success', '0': 'info' }
      return statusMap[status]
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
        ip: '',
        id: '',
        startTime_create: '',
        endTime_create: ''
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
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
      // temp: {
      //   id: undefined,
      //   enabled: 1,
      //   createdAt: new Date(),
      //   name: '',
      //   email: ''
      // }
    }
  },
  created() {
    this.getWhitelistAll()
  },
  // watch:{
  //   '$route'(val){
  //     if(val.name == 'systemUserList')
  //       this.handleFilter()
  //   }
  // },
  methods: {
    async getWhitelistAll() {
      this.listLoading = true
      const response = await getWhitelistAll(this.listQuery)
      console.log(response)
      if (response.code === 200) {
        this.list = response.data.records
        this.total = response.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getWhitelistAll()
    },
    resetFilter() {
      this.listQuery = {
        page: 1,
        pageSize: 50,
        name: undefined,
        id: '',
        startTime_create: '',
        endTime_create: ''
      };
      this.getWhitelistAll();
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

    onDel(id) {
      this.$confirm('确定要删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWhitelist([id]).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getWhitelistAll()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃删除'
        })
      })
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    handleSelectionChange(val) {
      this.ids = [];
      val.forEach((item, key) => {
        this.ids.push(item.id);
      });
    },

    onBatchDelete() {
      if (!this.ids || this.ids.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择敏感词",
        });
        return;
      }
      this.$confirm("确定要进行批量删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delWhitelist(this.ids)
            .then(() => {
              this.$message({
                type: "success",
                message: "批量删除成功",
              });
              this.getWhitelistAll();
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
}
</script>
