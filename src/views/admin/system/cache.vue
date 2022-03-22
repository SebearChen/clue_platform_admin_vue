<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row class="tip">
        查询提示： 查询KEY尽可能精确匹配或高度模糊匹配，不允许简单模糊匹配，以免引起查询大量的KEY
      </el-row>
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input
            v-model="listQuery.key"
            placeholder="缓存key"
            style="width: 180px"
            class="filter-item"
            size="small"
            clearable
            @keypress.native.enter="handleFilter"
          />
          &nbsp;
          <el-select v-model="listQuery.type" placeholder="请选择type" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
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

         <el-col :span="6" align="right" class="small-padding">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small" @click="batchDelete">
              {{ $t('table.delete') }}
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
      height="600"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column fixed label="key" prop="id" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.key }}</span> </template>
      </el-table-column>

      <el-table-column fixed label="value" align="left">
        <template slot-scope="{row}">
            <span class="link-type">{{ row.value }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="onDel(row.key)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getCacheList, delCache } from '@/api/system/cache'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'systemCache',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 50,
        key: "",
        type: '1'
      },
      keys: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      options: [{
        value: '1',
        label: 'string'
      },{
        value: '2',
        label: 'list（长度）'
      },{
        value: '3',
        label: 'hash'
      },{
        value: '4',
        label: 'list（值）'
      }]
    }
  },
  // created() {
  //   this.getList()
  // },
  // watch:{
  //   '$route'(val){
  //     if(val.name == 'systemUserList')
  //       this.handleFilter()
  //   }
  // },
  methods: {
    async getList() {
      this.listLoading = true
      const response = await getCacheList(this.listQuery)
      if (response.code === 200) {
        this.list = response.data.records
        this.total = response.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter(){
      listQuery = {
        pageNo: 1,
        pageSize: 50,
        key: "",
        type: '1'
      },
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
    handleSelectionChange(val){
      this.keys = '';
      val.forEach((item, key) => {
        this.keys += item.key + ',';
      });
    },
    onDel(key) {
      this.$confirm('确定要删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCache({'key': key}).then(() => {
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
    batchDelete(){
      if (!this.keys || this.keys.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的缓存",
        });
        return;
      }
      console.log(this.keys)
      this.onDel(this.keys)
    }
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
  }
}
</script>

<style lang="scss" scoped>
.tip{
  color: red;
  line-height: 40px;
}
</style>