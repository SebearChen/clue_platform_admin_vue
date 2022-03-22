<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="18" align="left" class="small-padding">
          <el-input size="small" v-model="listQuery.activityId" placeholder="专题ID" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.activityName" placeholder="专题名称" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.name" placeholder="客户姓名" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.phone" placeholder="客户手机号" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-select size="small" v-model="listQuery.syncStatus" placeholder="同步状态" clearable class="filter-item" style="width: 130px" @change="handleFilter">
            <el-option v-for="k in statusOptList" :key="k.id" :label="k.value" :value="k.id" />
          </el-select>
          &nbsp;
          <el-select size="small" v-model="listQuery.valid" placeholder="线索状态" clearable class="filter-item" style="width: 130px" @change="handleFilter">
            <el-option v-for="k in statusValidList" :key="k.id" :label="k.value" :value="k.id" />
          </el-select>
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-search" circle @click="handleFilter" />
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-refresh-left" circle @click="resetFilter" />
        </el-col>

         <el-col :span="6" align="right" class="small-padding">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small" @click="onBatchDelete">
              {{ $t('table.batchDelete') }}
            </el-button>
        </el-col>
      </el-row>

      <!-- <el-row class="row-mg">
        <el-col :span="3" align="left" class="small-padding">
          <el-button class="uploat-file--p" type="primary" size="small">
            <input class="uploat-file" type="file" @change="getFile">
            导入线索
          </el-button>
        </el-col>
        <el-col :span="3" align="left" class="small-padding">
          <el-button type="primary" plain size="small" @click="enrollExport">导出留资数据</el-button>
        </el-col>
      </el-row> -->
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
      height="540"
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column fixed label="线索ID" prop="id" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.id ||  '-' }}</span> </template>
      </el-table-column>

      <el-table-column fixed label="专题ID" width="80" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.activityId || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="专题名称" width="200" align="center">
        <template slot-scope="{row}">
          <router-link :to="`/clue/${row.id}`">
            <span class="link-type">{{ row.activityName || '-'}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="客户手机" width="150" align="center">
        <template slot-scope="{row}">
          {{row.phone ||  '-' }}
        </template>
      </el-table-column>

      <el-table-column label="客户姓名" width="100" class-name="status-col">
        <template slot-scope="{row}">
          {{row.name ||  '-' }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" class-name="status-col">
        <template slot-scope="{row}">
          {{row.gender ||  '-' | formatGender()}}
        </template>
      </el-table-column>
      

      <el-table-column fixed="right" label="线索来源" align="center">
        <template slot-scope="{row}">
          {{typeList[row.type] ||  '-' }}
        </template>
      </el-table-column>

      <el-table-column label="地区" align="center">
        <template slot-scope="{row}">
          <span class="textWidth">{{row.province ||  '-'}} / {{row.city ||  '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="经销商" align="center">

        <template slot-scope="{row}">
          <span class="textWidth">{{ row.dealer ||  '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="车系" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serial ||  '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="车型" align="center">
        <template slot-scope="{row}">
          {{row.model ||  '-'}}
        </template>
      </el-table-column>

      <el-table-column label="ip" width="150" align="center">
        <template slot-scope="{row}">
          {{row.ip ||  '-' }}
        </template>
      </el-table-column>  

      <el-table-column fixed="right" label="线索状态" align="center">
        <template slot-scope="{row}">
          <span>{{statusValids[row.valid] || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="同步信息" width="200" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.syncMsg">
            <p class="row-str--ellipsis" slot="reference">{{ row.syncMsg ||  '-' }}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="扩展参数" width="500" align="center">
        <template slot-scope="{row}">
          <el-popover
            placement="bottom-start"
            width="250"
            trigger="click"
            :content="row.params">
            <p class="row-str--ellipsis" slot="reference">{{ row.params ||  '-' }}</p>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="同步状态" align="center">
        <template slot-scope="{row}">
          {{statusOpts[row.syncStatus] ||  '-' }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="onDel(row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getEnrollLsit" />
  </div>
</template>

<script>
import { del, getEnrollLsit, getEnrollOne, enrollImport, enrollExport, batchDelete } from '@/api/clue'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusOpts = {
  "0": '未同步',
  "1": '同步中',
  "2": '同步成功',
  "3": '同步失败'
}
const typeList = {
  "0": '用户提交',
  "1": '后台导入',
  "2": '广告分析系统',
  "3": '睿集客'
}
const statusValids = {
  0: "异常",
  1: "有效",
  2: "重复",
  3: "黑名单"
};

const defaultForm = {
  activityId: '',
  activityName: '',
  name: '',
  page: 1,
  pageSize: 50,
  phone: '',
  source: '',
  syncStatus: '',
  status: ''
}

export default {
  name: 'ClueList',
  components: { Pagination },
  directives: { waves },
  filters: {
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
      listQuery: Object.assign({}, defaultForm),
      statusOpts,
      typeList,
      statusValids,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: '',
        email: ''
      },
      ids: []
    }
  },
  computed: {
    statusOptList() {
      const arr = []
      Object.keys(statusOpts).forEach(i=> {
        arr.push({
          id: i,
          value: statusOpts[i]
        })
      })
      return arr
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
  },
  created() {
    this.getEnrollLsit()
  },
  methods: {
    async getEnrollLsit() {
      this.listLoading = true
      const response = await getEnrollLsit(this.listQuery)
      if(response.code == 200) {
        this.list = response.data.rows
        this.total = response.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getEnrollLsit()
    },
    resetFilter() {
      this.listQuery = Object.assign({}, defaultForm)
      this.getEnrollLsit()
    },
    async enrollExport() {
      const res = await enrollExport(this.listQuery)
      console.log(res)
      window.open(res, '_blank')
      // window.location.href = res
    },
    async getFile(e) {
      console.log(e)
      const _file = e.target.files[0]
      console.log(_file)
      let formData = new FormData()
      formData.append('file', _file)
      const res = await enrollImport(formData)
      console.log(res)
      if(res.code==200) {

      }
    },
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
          this.getEnrollLsit()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '放弃删除'
        })
      })
    }, // onDel()
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
              this.getEnrollList();
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
