<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input size="small" v-model="listQuery.name" placeholder="商户名称" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.id" placeholder="商户ID" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-search" circle @click="handleFilter" />
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-refresh-left" circle @click="resetFilter" />
        </el-col>
        <el-col :span="6" align="right" class="small-padding">
          <router-link :to="'/business/create'">
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
      <el-table-column fixed label="ID" width="80" align="center">
        <template slot-scope="{row}"> <span>{{ row.id ||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="商户名称" align="center">
        <template slot-scope="{row}"> <span>{{ row.name ||  '-'}}</span> </template>
      </el-table-column>
      <!-- <el-table-column width="80" label="品牌ID" align="center" >
        <template slot-scope="{row}"> <span>{{ row.brandId ||  '-'}}</span> </template>
      </el-table-column> -->
      <el-table-column label="品牌名称" align="center">
        <template slot-scope="{row}"> <span>{{ row.brandName ||  '-'}}</span> </template>
      </el-table-column>
      <!-- <el-table-column label="厂商ID" align="center" >
        <template slot-scope="{row}"> <span>{{ row.mfId	||  '-'}}</span> </template>
      </el-table-column> -->
      <el-table-column label="厂商名称" align="center">
        <template slot-scope="{row}"> <span>{{ row.mfName	||  '-'}}</span> </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}"> <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="{row}"> <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column>

      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/business/'+row.id">
            <el-button size="small" type="info" icon="el-icon-edit" circle />
          </router-link> &nbsp; &nbsp;
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="onDel(row.id, row.name)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getFirmList, delFirm } from '@/api/business'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
  id: '',
  name: '',
  page: 1,
  pageSize: 50,
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
      if(val.name == 'businessList')
        this.handleFilter()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getFirmList(this.listQuery).then(response => {
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
        delFirm(id).then(() => {
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
