<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="22" align="left" class="small-padding">
          <el-input size="small" v-model="listQuery.name" :placeholder="$t('subject.name')" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.id" placeholder="专题ID" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.follower" placeholder="对接人" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
            &nbsp;
          <el-input size="small" v-model="listQuery.link" placeholder="专题连接" style="width: 180px;" class="filter-item" clearable @keypress.native.enter="handleFilter"/>
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
            v-for="k in projectOptsList"
            :key="k.id"
            :label="k.value"
            :value="k.id"
          />
          </el-select>
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-search" circle @click="handleFilter" />
            &nbsp;
          <el-button size="small" style="margin-left:10px; padding-bottom:10px" icon="el-icon-refresh-left" circle @click="resetFilter" />
          &nbsp;
        </el-col>

        <el-col :span="2" align="right" class="small-padding">
          <!-- <router-link :to="'/subject/export'">
            <el-button class="pan-btn-min light-blue-btn" style="margin-left: 10px;" type="primary" size="small">
              {{ $t('table.batchExport') }}
            </el-button>
          </router-link> -->

          <router-link :to="'/subject/create'" v-if="isAdmin">
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
      <el-table-column label="id" prop="id" align="center" width="60" :class-name="getSortClass('id')"> 
        <template slot-scope="{row}"> <span>{{ row.id ||  '-' }}</span> </template>
      </el-table-column>

      <el-table-column label="专题状态" width="80" align="center" prop="status">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.status == 1">未开始</el-tag>
          <el-tag type="success" v-if="row.status == 2">进行中</el-tag>
          <el-tag type="info" v-if="row.status == 3">已结束</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('subject.name')" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/subject/detail/'+row.id" v-if="isAdmin">
            <span class="link-type textWidth">{{ row.name ||  '-' }}</span>
          </router-link>
          <span v-else class="link-type textWidth">{{ row.name ||  '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('subject.link')" align="center">
        <template slot-scope="{row}">
          <el-popover
              placement="bottom-start"
              trigger="hover"
              class="textWidth"
              :content="row.link">
              <p class="row-str--ellipsis textWidth" @click="skipUrl(row)" style="text-align: left;" slot="reference">{{ row.link ||  '-' }}</p>
            </el-popover>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="$t('table.desc')" min-width="250" align="center">
        <template slot-scope="{row}">
            <el-popover
              placement="bottom-start"
              width="250"
              trigger="click"
              :content="row.description">
              <p class="row-str--ellipsis" style="text-align: left;" slot="reference">{{ row.description ||  '-' }}</p>
            </el-popover>
        </template>
      </el-table-column> -->

      <el-table-column :label="$t('table.startTime')" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.endTime')" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.follower')" class-name="status-col">
        <template slot-scope="{row}">
          <span>{{ row.follower ||  '-' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.createTime')" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateTime')" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column fixed="right" :label="$t('table.actions')" align="center" :width="isAdmin?'220':'200'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="`/subject/detail/${row.id}`">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link> &nbsp; &nbsp;
          <router-link :to="'/subject/set-task/'+row.id" v-if="isAdmin">
            <el-button type="primary"  size="mini">对接配置</el-button>
          </router-link> &nbsp; &nbsp;
          <router-link :to="{ path: `/subject/clue-list/${row.id}`, query: { name: row.name, tag: row.paramsKeys? 1 : 0}}">
            <el-button type="primary" size="mini" >查看线索</el-button>
          </router-link> &nbsp; &nbsp;
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getLst, del } from '@/api/subject'
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

const projectOpts = {
  0: "未知",
  1: "未开始",
  2: "进行中",
  3: "已结束",
}

const defaultForm = {
  id: '',
  name: '',
  page: 1,
  pageSize: 50,
  follower: '',
  link: ''
}

export default {
  name: 'SubjectList',
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
      listQuery: Object.assign({}, defaultForm),
      statusOpts,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: '',
        email: ''
      },
      projectOpts
    }
  },
  computed: {
    isAdmin() {return this.$store.state.user.isAdmin },
    projectOptsList() {
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
  activated() {
    this.getList()
  },
  created() {
    this.getList()
  },
  watch:{
    '$route'(val){
      if(val.name == 'subjectList')
        this.handleFilter()
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await getLst(this.listQuery)

      if (res.code == 200) {
        this.list = res.data.rows
        this.total = res.data.total
      }
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
      this.listQuery = Object.assign({}, defaultForm)
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        enabled: 1,
        createdAt: new Date(),
        name: '',
        email: ''
      }
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
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    skipUrl(row) {
      window.open(row.link, '_blank')
    }
  }
}
</script>
