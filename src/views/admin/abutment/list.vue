<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" align="left" class="small-padding">
          <el-input size="small" v-model="listQuery.name" placeholder="对接器名称" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.id" placeholder="对接器id" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.key" placeholder="对接器标识" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;          
          <el-input size="small" v-model="listQuery.follower" placeholder="对接人" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-search" circle @click="handleFilter" />
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-refresh-left" circle @click="resetFilter" />
        </el-col>
        <el-col :span="4" align="right" class="small-padding">
          <router-link :to="'/abutment/create'">
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
      height="540"
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" width="38" align="center">
        <template slot-scope="{row}"> <span>{{ row.id ||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="对接器名称" align="center">
        <template slot-scope="{row}"> <span>{{ row.name ||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="商户名称" align="center">
        <template slot-scope="{row}"> <span>{{ row.firmName ||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="对接器标识" align="center">
        <template slot-scope="{row}"> <span>{{ row.dockKey	||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="对接人" align="center">
        <template slot-scope="{row}"> <span>{{ row.follower	||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="扩展参数Keys" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.paramsKeys">
            <p class="row-str--ellipsis" slot="reference">{{ row.paramsKeys  ||  '-'}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="扩展参数名" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.paramsNames">
            <p class="row-str--ellipsis" slot="reference">{{ row.paramsNames ||  '-'}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="120">
        <template slot-scope="{row}"> <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="120">
        <template slot-scope="{row}"> <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/abutment/'+row.id">
            <el-button type="info" size="small" icon="el-icon-edit" circle />
          </router-link> &nbsp;
          <el-button type="danger" size="small" icon="el-icon-delete" circle @click="onDel(row.id, row.name)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getList, del } from '@/api/abutment'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
  id: '',
  name: '',
  page: 1,
  pageSize: 50,
  follower: '',
  key: ''
}

export default {
  name: 'BusinessList',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: Object.assign({}, defaultForm)
    }
  },
  created() {
    this.getList()
  },
  watch:{
    '$route'(val){
      if(val.name == 'abutmentList')
        this.handleFilter()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total

        this.listLoading = false
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
      this.listQuery = Object.assign({}, defaultForm)
      this.getList()
    },
    onDel(id, name) {
      console.log(id)
      this.$confirm(`确定要删除 ${name}？`, '警告', {
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
    }
  }
}
</script>
