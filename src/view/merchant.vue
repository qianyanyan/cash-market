<template>
  <div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd" v-if="createShow">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.merchantUid" placeholder="请输入广告商外部ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.gmtModifiedStart"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择开始日期"
            :picker-options="startPickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.gmtModifiedEnd"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择结束日期"
            :picker-options="endPickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getMerchantList">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-input v-model="search" placeholder="请输入关键字"></el-input>
        </el-form-item>
      </el-form>
    </el-col>


    <el-table
      ref="singleTable"
      :data="searchData"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        property="id"
        label="广告商内部ID">
      </el-table-column>
      <el-table-column
        property="merchantUid"
        label="广告商外部ID">
      </el-table-column>
      <el-table-column
        property="comment"
        label="广告商说明">
      </el-table-column>
      <el-table-column
        property="secretKey"
        label="广告商秘钥">
      </el-table-column>
      <el-table-column
        property="gmtCreate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        property="gmtModified"
        label="修改时间">
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="modifyShow">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="广告商说明" prop="comment">
          <el-input v-model="addForm.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="广告商内部ID：" prop="id">
          <span v-text="editForm.id"></span>
        </el-form-item>
        <el-form-item label="广告商外部ID：" prop="merchantUid">
          <span v-text="editForm.merchantUid"></span>
        </el-form-item>
        <el-form-item label="广告商说明：" prop="comment">
          <el-input v-model="editForm.comment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告商秘钥：" prop="merchantUid">
          <span v-text="editForm.secretKey"></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageSize" :page-sizes="pageSizes" :total="totalPage" style="float:right;">
      </el-pagination>
    </el-col>

  </div>
</template>
<script>
  import { getApi } from '../api/api'
  import global from '../assets/js/global'

  export default {
    data () {
      return {
        tableData: [],
        tableFData: [],
        listLoading: false,
        addFormVisible: false,
        addLoading: false,
        addForm: {},
        addFormRules: {
          comment: [
            { required: true, message: '请输入说明', trigger: 'blur' }
          ]
        },
        filters: {
          merchantUid: '',
          gmtModifiedStart: '',
          gmtModifiedEnd: ''
        },
        createShow: false,
        editFormVisible: false,
        editLoading: false,
        editForm: {},
        // 编辑界面临时存放数据，用于比较是否有修改
        editFormContainer: {},
        editFormRules: {
          comment: [
            { required: true, message: '请编辑说明', trigger: 'blur' }
          ]
        },
        totalPage: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        modifyShow: false,
        startPickerOptions: this.beginDate(),
        endPickerOptions: this.processDate(),
        search: ''
      }
    },
    mounted () {
      this.getMerchantList()
      this.createShow = global.judgePermissionName('merchant:create', this.$store.getters.getPermissionName)
      this.modifyShow = global.judgePermissionName('merchant:modify', this.$store.getters.getPermissionName)
    },
    computed: {
      searchData () {
        var search = this.search;
        if (search) {
         let ddd = this.tableData.filter(function(item) {
            return Object.keys(item).some(function(key) {
                return String(item[key]).toLowerCase().indexOf(search) > -1
            })
          })
          this.totalPage =ddd.length
           ddd = ddd.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + this.pageSize)
          return ddd
        }else{
           this.totalPage =this.tableData.length
        }
         return this.tableFData;
      }
    },
    methods: {
      processDate () {
        let vm = this
        return {
          disabledDate (time) {
            if (vm.filters.gmtModifiedStart) {
              return new Date(vm.filters.gmtModifiedStart).getTime() > time.getTime()
            }
          }
        }
      },
      beginDate () {
        let vm = this
        return {
          disabledDate (time) {
            if (vm.filters.gmtModifiedEnd) {
              return new Date(vm.filters.gmtModifiedEnd).getTime() < time.getTime()
            }
          }
        }
      },
      getMerchantList () {
        let vm = this
        if (typeof vm.filters.gmtModifiedStart == 'object') {
          vm.filters.gmtModifiedStart = Date.parse(vm.filters.gmtModifiedStart)
        }
        if (typeof vm.filters.gmtModifiedEnd == 'object') {
          vm.filters.gmtModifiedEnd = Date.parse(vm.filters.gmtModifiedEnd)
        }
        getApi('merchantList', vm.filters, function (res) {
          if (res.data.code === 200) {
            vm.totalPage = res.data.total
            vm.tableData = res.data.data.merchantList
            vm.fPage(vm.tableData)
          }
        })
      },
      // 显示新增界面
      handleAdd () {
        this.addFormVisible = true
      },
      // 显示编辑界面
      handleEdit (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row);
        this.editFormContainer = Object.assign({}, row);
      },
      // 新增
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true
              let addMerchantParams = this.addForm
              let vm = this
              getApi('addMerchant', addMerchantParams, function (res) {
                vm.addLoading = vm.addFormVisible = false
                vm.$refs['addForm'].resetFields()
                if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                  vm.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  vm.getMerchantList()
                } else {
                  vm.$message({
                    message: res.data.message,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },

      editSubmit () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              if (this.editFormContainer.comment == this.editForm.comment) {
                this.editFormVisible = this.editLoading = false
                this.$refs['editForm'].resetFields()
                this.$message({
                  message: '编辑数据不能与原数据相同',
                  type: 'error'
                })
              } else {
                let merchantParams = {
                  id: this.editForm.id,
                  comment: this.editForm.comment
                }
                let vm = this
                getApi('modifyMerchant', merchantParams, function (res) {
                  vm.editFormVisible = vm.editLoading = false
                  vm.$refs['editForm'].resetFields()
                  if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                    vm.$message({
                      message: '提交成功',
                      type: 'success'
                    })
                    vm.getMerchantList()
                  } else {
                    vm.$message({
                      message: res.data.message,
                      type: 'error'
                    })
                  }
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.fPage(this.tableData)
      },
      handleSizeChange (size){
        this.pageSize = size
        this.fPage(this.tableData)
      },
      fPage (list) {
        this.tableFData = list.slice((this.currentPage - 1)*10,(this.currentPage - 1)*10 + this.pageSize)
      }
    },
    watch: {
      addFormVisible (val) {
        if (!val) {
          this.$refs['addForm'].resetFields()
        }
      },
      searchData (val) {
        this.totalPage = val.length
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

  .el-submenu [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }
  .el-menu-item [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }
  .toolbar {
    padding: 10px;
    margin: 10px 0px;
  }
  .toolbar .el-form-item {
    margin-bottom: 10px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
