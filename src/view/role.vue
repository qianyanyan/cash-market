<template>
  <div>
    <div class="table">
      <div class="mangent" style="width: 45%;float: left">
        <div class="handle-box">
          <el-button type="primary" @click="addlist">新增</el-button>
        </div>
        <el-table :row-class-name="tableRowClassName" ref="singleTable1" :data="tableData" style="width: 90%;float: left" @row-click="clickTale" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column prop="roleExplain" label="名称">
          </el-table-column>
          <el-table-column prop="roleName" label="code">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="modifyShow">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row,0)" v-if="deleteShow">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--新增角色界面-->
        <el-dialog title="新增角色" v-model="addVisible" :close-on-click-modal="false">
          <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
            <el-form-item label="名称" prop="roleExplain">
              <el-input v-model="editForm.roleExplain" auto-complete="off" type="text"></el-input>
            </el-form-item>
            <el-form-item label="code" prop="roleName">
              <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit(0)" :loading="editLoading">提交</el-button>
          </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
          <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
            <el-form-item label="名称" prop="roleExplain">
              <el-input v-model="editForm.roleExplain" auto-complete="off" type="text"></el-input>
            </el-form-item>
            <el-form-item label="code" prop="roleName">
              <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit(1)" :loading="editLoading">提交</el-button>
          </div>
        </el-dialog>

        <!--新增用户界面-->
        <el-dialog v-model="addFormVisible" :close-on-click-modal="false">
          <h2 class="addRole">为{{roles}}添加用户</h2>
          <el-table ref="singleTable" :data="searchUsers" @select="seleIdevry" @select-all ="seleId" highlight-current-row
                    v-loading="listLoading" style="width: 100%" >
            <el-table-column type="selection" width="55" >
            <!-- <el-table-column type="selection" width="55"> -->
            </el-table-column>
            <el-table-column property="accounts" label="账户" width="280" align="center">
            </el-table-column>
            <el-table-column property="roleName" label="角色名称">
            </el-table-column>

          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
             <!-- <el-button @click="toggleSelection([searchUsers[1], searchUsers[2]])">切换第二、第三行的选中状态</el-button> -->
          </div>
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-pagination layout="sizes,prev, pager, next, jumper" @current-change="handleCurrentChangeadd" @size-change="handleAddChangea"
                           :page-size="addpageSize" :page-sizes="[10, 20, 30, 40]" :total="totalAdd" style="float:right;">
            </el-pagination>
          </el-col>
        </el-dialog>
      </div>
    </div>
    <!-- 角色里的用户 -->
    <div class="user">
      <div class="roleList">
        <div class="handle-box">
          <el-button type="primary" @click="handleAdd" v-if="createShow">新增</el-button>
          <el-input v-model="select_words" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        </div>
        <el-table :data="datas" style="width:55%;float: right" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column  type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column prop="accounts" label="名字" width="150">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row,1)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total,sizes,prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                         :page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :total="total" style="float:right;">
          </el-pagination>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
  import { getApi } from '../api/api'
  import global from '../assets/js/global'
  export default {
    data() {
      return {
        currentPage: 1,
        currentPageadd: 1,
        tableData: [],
        tableFData: [],
        searchUsers: [],
        userData: [],
        addUser: [],
        boxId: [],
        permissionName: [],
        cur_page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        // cur_addpage: 1,
        addpageSize: 10,
        addpageSizes: [10, 20, 30, 40],
        multipleSelection: [],

        total: 0,
        totalAdd: 0,
        select_words: '',
        del_list: [],
        num: 1,
        role: "admin",
        roles: "",
        is_search: true,

        // 编辑界面是否显示
        editFormVisible: false,
        // 新增界面是否显示
        addFormVisible: false,
        listLoading: false,
        editLoading: false,
        editFormRules: {
          roleName: [
            { required: true, message: '请输入code', trigger: 'blur' }
          ],
          roleExplain: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        addFormRules: {
          roleName: [
            { required: true, message: '请输入code', trigger: 'blur' }
          ],
          roleExplain: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {},
        // 新增界面数据
        addForm: {},
        addLoading: false,
        addVisible: false,
        // 显示新增界面
        createShow: false,
        modifyShow: false,
        deleteShow: false,
        pageData:[],
        // allSelection :[],
        // search: '',

      }
    },
    created() {
      this.getData();
      this.getUser();
    },
    mounted() {
      this.createShow = global.judgePermissionName('role:createUser', this.$store.getters.getPermissionName)
      this.modifyShow = global.judgePermissionName('role:modify', this.$store.getters.getPermissionName)
      this.deleteShow = global.judgePermissionName('role:delete', this.$store.getters.getPermissionName)
    },
    watch: {
     
    },
    computed: {
      datas() {
        const self = this;
        if(self.select_words){

          let pageD = self.userData.filter(function (d) {
            let is_del = false;
            for (let i = 0; i < self.del_list.length; i++) {
              if (d.name === self.del_list[i].name) {
                is_del = true;
                break;
              }
            }
            let a = 0;
            if (!is_del) {
              if (d.accounts.indexOf(self.select_words) > -1 || d.roleName.indexOf(self.select_words) > -1) {
                return d;
              }
            }
          })
          self.total = pageD.length;
          pageD = pageD.slice((self.currentPage - 1) * 10, (self.currentPage - 1) * 10 + self.pageSize)
          return pageD
        }else{
          self.total = self.userData.length;
          return self.pageData
        }
      },

    },
    methods: {
      tableRowClassName(row, index) {
        if (index === 0) {
          return 'current-row';
        }

      },
      // toggleSelection(rows) {
      //   if (rows) {
      //     rows.forEach(row => {
      //       this.$refs.singleTable.toggleRowSelection(row);
      //     });
      //   } else {
      //     this.$refs.singleTable.clearSelection();
      //   }
      // },
      fPage(list, type) {
        if (type == 0) {
          this.pageData = list.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + this.pageSize)

        } else {
          this.searchUsers = list.slice((this.currentPageadd - 1) * 10, (this.currentPageadd - 1) * 10 + this.addpageSize)
        }
      },
      setCurrent(row) {
        this.$refs.singleTable1.setCurrentRow(row);
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.fPage(this.data, 0)
      },
      handleAddChangea(size) {
        this.addpageSize = size
        this.fPage(this.addUser, 1)

      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
        this.getUser();
      },
      handleCurrentChangeadd(val) {
        this.currentPageadd = val;
         console.log(this.selection)
        //  this.searchUser()
        this.fPage(this.addUser, 1)
      },
      getData() {
        let self = this;
        getApi('searchRole', function (res) {
          if (res.data.code === 200) {
            self.tableData = res.data.data;
            self.role = res.data.data[0].roleName
            self.roles = res.data.data[0].roleExplain;
          }
        })
      },
      getUser() {
        let self = this;
        let userParams = {
          roleId: this.num
        };
        getApi('selectUser', userParams, function (res) {
          if (res.data.code === 200) {
            self.total = res.data.total;
            self.userData = res.data.data;
            self.fPage(self.userData, 0)
          }
        })
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleEdit(index, row) {
        this.editFormVisible = true
        // this.editForm = row;
        this.editForm = Object.assign({}, row);

      },
      addlist() {
        this.addVisible = true;
        this.editForm ={};

      },

      handleDelete(index, row, type) {
        // this.$message.error('删除第'+(index+1)+'行');

        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let arr = []
          arr.push(row.id)
          let para = {
            roleId: this.num,
            userId: arr
          }
          let obj = {
            id: this.num
          }
          let vm = this
          if (type == 0) {
            getApi('deleteRoleBatch', obj, function (res) {
              if (res.data.code == 200) {
                vm.listLoading = false
                vm.$message({
                  message: '删除成功',
                  type: 'success'
                })
                vm.getData();
              }
            })
          } else {
            getApi('deleteSysUserRoleBatch', para, function (res) {
              if (res.data.code == 200) {
                vm.listLoading = false
                vm.$message({
                  message: '删除成功',
                  type: 'success'
                })
                vm.getUser();
              }
            })
          }

        }).catch(() => {
        })
      },
      delAll() {
        const self = this,
          length = self.multipleSelection.length;
        let str = '';
        self.del_list = self.del_list.concat(self.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += self.multipleSelection[i].roleName + ' ';
        }
        self.$message.error('删除了' + str);
        self.multipleSelection = [];
      },
      // 编辑
      editSubmit(type) {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let userParams = {
                id: this.editForm.id,
                roleName: this.editForm.roleName,
                roleExplain: this.editForm.roleExplain,
              }
              let addParams = {

                roleName: this.editForm.roleName,
                roleExplain: this.editForm.roleExplain,
              }
              let vm = this
              if (type == 1) {
                getApi('modifyRole', userParams, function (res) {
                  if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                    vm.editFormVisible = vm.editLoading = false
                    vm.$message({
                      message: '提交成功',
                      type: 'success'
                    })
                    vm.getData()
                  }
                })
              } else {
                getApi('addRole', addParams, function (res) {
                  if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                    // vm.addVisible = vm.editLoading = false
                    vm.$message({
                      message: '提交成功',
                      type: 'success'
                    })
                    vm.getData()
                  }else if(res.data.code == 400) {
                    vm.$message({
                      message: '新增角色中有重复信息',
                      type: 'error'
                    })

                  } else {
                    vm.$message({
                      message: res.data.message,
                      type: 'error'
                    })
                  }
                   vm.addVisible = vm.editLoading = false
                })
              }
            })
          } else {
            return false
          }
        })
      },
      handleSelectionChange(val) {

        this.multipleSelection = val;
      },
      clickTale(row, event, column) {
        this.num = row.id;
        this.roles = row.roleExplain;
        this.getUser()

      },
      seleIdevry(selection, row){
              let length = selection.length;
              console.log(length)
              this.selection = selection;
      },
      seleId(selection, row) {
        debugger
        let length = selection.length;
      
      },
      searchUser() {
        let self = this;
        let userParams = {
          isNotroleId: this.num
        };
        getApi('searchUserForRole', userParams, function (res) {
          if (res.data.code === 200) {
            self.addUser = res.data.data;
            self.totalAdd = res.data.total;
            self.fPage(self.addUser, 1)
          }
        })
      },
      handleAdd() {
        this.addFormVisible = true
        this.searchUser()
      },
      // 新增
      addSubmit() {
        var  length = this.selection.length;
        for (let i = 0; i < length; i++) {
          this.boxId.push(this.selection[i].id);
        }
        if (this.boxId) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = {
              roleId: this.num,
              userId: this.boxId
            }
            let vm = this
            getApi('addSysUserRoleBatch', para, function (res) {
              vm.addLoading = vm.addFormVisible = false
              if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                vm.$message({
                  message: '提交成功',
                  type: 'success'
                })
                vm.getUser()
              }
              vm.boxId =[ ];
            })
          })
        }

      }

    }
  }
</script>

<style scoped>
  .handle-box{
    margin-bottom: 20px;
  }
  .handle-select{
    width: 120px;
  }
  .handle-input{
    width: 300px;
    display: inline-block;
  }
  .addRole{
    text-align: center;
    margin-top: -20px;
    font-size: 25px;
    margin-bottom: 20px;
  }
</style>
