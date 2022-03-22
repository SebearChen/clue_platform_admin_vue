<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input size="small" v-model="listQuery.name" placeholder="名字" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" clearable/>
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-search" circle @click="handleFilter" />
        </el-col>

        <el-col :span="6" align="right" class="small-padding">
          <router-link :to="'/system/role/create'">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small">
              {{ $t('table.add') }}
            </el-button>
          </router-link>
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
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.id ||  '-' }}</span> </template>
      </el-table-column>

      <el-table-column label="角色名称" align="left">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name || '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最后修改人" align="left">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.updateUsername ||  '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status ||  '-' | enabledFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/system/role/detail/'+row.id">
            <el-button size="small" type="info" icon="el-icon-edit" circle />
          </router-link> &nbsp; &nbsp;
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="onDel(row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getList, del } from '@/api/system/role'
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
  name: 'RoleList',
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
        limit: 10,
        name: undefined,
        sort: '+id'
      },
      statusOpts,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: '',
        email: ''
      }
    }
  },
  created() {
    this.getList()
  },
  watch:{
    '$route'(val){
      console.log(val)
      if (val.name == 'systemRoleList')
        this.handleFilter()
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      const response = await getList(this.listQuery)
      if (response.code === 200) {
        this.list = response.data
        // this.total = response.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: '',
        email: ''
      }
    }, // resetTemp()

    onDel(id) {
      this.$confirm('确定要删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃删除'
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
