<template>
    <div> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="使用中" name="first"> 
            </el-tab-pane>
            <el-tab-pane label="已下线" name="second">
            </el-tab-pane>
        </el-tabs>
        <!-- table列表 -->
   <table-use ref="chil" v-on:listenHandleAdd ="handleAdd" v-bind:searchData ="searchData" :istab="istab" :tableData ="tableData" :totalPage ="totalPage" v-on:fPage ="fPage"></table-use>
 
<!--编辑界面-->
<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="广告名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-input v-model="editForm.tags" auto-complete="off" type="text" placeholder="请以英文分号隔开"></el-input>
        </el-form-item>
        <el-form-item label="广告banner位置" prop="bannerNo">
            <el-select v-model="editForm.bannerNo" placeholder="请选择广告banner位置">
                <el-option v-for="item in filteradd.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="目标路径" prop="targetUrl">
            <el-input v-model="editForm.targetUrl" auto-complete="off" type="text" placeholder="请输入目标路径"></el-input>
        </el-form-item>
        <el-form-item label="备注详情" prop="details">
            <el-input v-model="editForm.details" auto-complete="off" type="text" placeholder="请输入备注详情"></el-input>
        </el-form-item>
        <el-form-item label="提示类型" prop="tipType">
            <el-select v-model="editForm.tipType" placeholder="请选择提示类型">
                <el-option v-for="item in tipTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上线时间" prop="onlineStartVO">
            <el-date-picker v-model="editForm.onlineStartVO" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择上线时间" :picker-options="startPickerOptions" @change="selectedOnline(editForm.onlineStartVO)">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="下线时间" prop="onlineEndVO">
            <!--<el-date-picker v-model="editForm.onlineEnd" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择下线时间" :picker-options="endPickerOptions">
            </el-date-picker>-->
             <el-date-picker
      v-model="editForm.onlineEndVO"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :picker-options="endPickerOptions" @change="selectedEnd(editForm.onlineEndVO)">
    </el-date-picker>
        </el-form-item>
        <el-form-item label="广告商ID" prop="merchantId">
            <el-select v-model="editForm.merchantId" disabled>
                <el-option v-for="item in neameIds" :key="item.id" :label="item.comment" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="轮播图" prop="img1" v-if="editForm.merchantId">
            <el-upload :headers="dataObjs" :data="dataObj" class="avatar-uploader" :action="baseurl" :show-file-list="false" :on-success="handleAvatarSuccessImg1">
                <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-label>上传图片大小为750*320px </el-label>
        </el-form-item>
        <el-form-item label="小图像" prop="img2" v-if="editForm.merchantId">
            <el-upload :headers="dataObjs" :data="dataObj" class="avatar-uploader" :action="baseurl" :show-file-list="false" :on-success="handleAvatarSuccessImg2">
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-label>上传图片大小为120*120px </el-label>
        </el-form-item>
        <el-form-item label="状态" prop="adStatus">
            <el-select v-model="editForm.adStatus" placeholder="请选择状态">
                <el-option v-for="item in filters.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weightNo">
            <el-select v-model="editForm.weightNo" placeholder="请选择权重" type="number">
                <el-option v-for="item in weightNos.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
</el-dialog>

<!--新增界面-->
<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="广告商名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入广告名称"></el-input>
        </el-form-item>
         <el-span class="second">  
            <el-input type="text" name="makeupCo" id="makeupCo" class="makeinp" onfocus="setfocus(this)" oninput="setinput(this);" placeholder="请选择或输入"/>  
           
           <el-select v-model="addForm.merchantId" placeholder="请选择广告商ID" id="typenum" onchange="changeF(this)" size="10" v-show="isShow">
                <el-option v-for="item in neameIds" :key="item.id" :label="item.comment" :value="item.id">
                </el-option>
           </el-select>
        </el-span>  
        <el-form-item label="广告名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-input v-model="addForm.tags" auto-complete="off" type="text" placeholder="请以英文分号隔开"></el-input>
        </el-form-item>
        <el-form-item label="banner位置" prop="addbannerNo">
            <el-select v-model="addForm.addbannerNo" placeholder="请选择banner位置">
                <el-option v-for="item in filteradd.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="目标路径" prop="targetUrl">
            <el-input v-model="addForm.targetUrl" auto-complete="off" type="text" placeholder="请输入目标路径"></el-input>
        </el-form-item>
        <el-form-item label="备注详情" prop="details">
            <el-input v-model="addForm.details" auto-complete="off" type="text" placeholder="请输入备注详情"></el-input>
        </el-form-item>
        <el-form-item label="提示类型" prop="tipType">
            <el-select v-model="addForm.tipType" placeholder="请选择提示类型">
                <el-option v-for="item in tipTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上线时间" prop="onlineStart">
            <el-date-picker v-model="addForm.onlineStart" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择上线时间" :picker-options="startPickerOptions" @change="selectedOnline(addForm.onlineStart)">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="下线时间" prop="onlineEnd">
            <el-date-picker v-model="addForm.onlineEnd" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择下线时间" :picker-options="endPickerOptions" @change="selectedEnd(addForm.onlineEnd)">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="广告商ID" prop="merchantId" >
            <el-select v-model="addForm.merchantId" placeholder="请选择广告商ID" >
                <el-option v-for="item in neameIds" :key="item.id" :label="item.comment" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="轮播图" prop="img1" v-if="name">
            <el-upload :headers="dataObjs" :data="dataObj" class="avatar-uploader" :action="baseurl" :show-file-list="false" :on-success="handleAvatarSuccessImg3">
                <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-label>上传图片大小为750*320px </el-label>
        </el-form-item>
        <el-form-item label="小图像" prop="img2" v-if="name">
            <el-upload :headers="dataObjs" :data="dataObj" class="avatar-uploader" :action="baseurl" :show-file-list="false" :on-success="handleAvatarSuccessImg4">
                <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-label>上传图片大小为120*120px </el-label>
        </el-form-item>
        <el-form-item label="权重" prop="addweightNo">
            <el-select v-model="addForm.addweightNo" placeholder="请选择权重">
                <el-option v-for="item in weightNos.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
</el-dialog>



</div>
</template>
<script>
   import tableUse from '../components/advites/tableUse'
    import { getApi, root } from '../api/api'
    import global from '../assets/js/global'

    export default {
        data() {
            const validatetag = (rule, value, callback) => {
                if (!global.istags(value)) {
                    callback(new Error('最多可添加三个标签，每个标签不超过5个字符'));
                } else {
                    callback();
                }
            };
            return {
                 activeName: 'first',
                 istab:0,
                 isShow:false,
                totalPage: 0,
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                search: '',
                dialogImageUrl: '',
                dialogVisible: false,
                dataObjs: { authorization: localStorage.getItem('userId') },
                dataObj: { cmarketMerchantId:""},
                currentAddStatus: false,
                listLoading: false,
                currentStatus: false,
                logining: false,
                tableData: [],
                neameIds: [],
                relIds: "",
                tableFData: [],
                // 编辑界面是否显示
                editFormVisible: false,
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入广告名称', trigger: 'blur' }
                    ],
                    tags: [
                        // { required: true, message: '请输入标签', trigger: 'blur' }
                         { required: true, message: '请输入标签', trigger: 'blur'},
                         { required: true, trigger: 'blur' ,validator: validatetag }
                    ],
                    bannerNo: [
                        { required: true, message: '请选择广告banner位置', trigger: 'change' }
                    ],
                    targetUrl: [
                        { required: true, message: '请输入目标路径', trigger: 'blur' }
                    ],
                    details: [
                        { required: true, message: '请输入备注详情', trigger: 'blur' }
                    ],
                    adStatus: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                    weightNo: [
                        { required: true, message: '请选择权重', trigger: 'change' }
                    ],
                },
                // 编辑界面数据
                editForm: {},
                // 编辑界面临时存放数据，用于比较是否有修改
                editFormContainer: {},
                // 新增界面是否显示
                addFormVisible: false,
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入广告名称', trigger: 'blur' }
                    ],
                    tags: [
                        { required: true, message: '请输入标签', trigger: 'blur'},
                        { required: true, trigger: 'blur' ,validator: validatetag }
                        //  { required: true, message: '请输入标签', trigger: 'blur' ,validator: validatetag }
                    ],
                    addbannerNo: [
                        { required: true, message: '请选择广告banner位置', trigger: 'change' }
                    ],
                    targetUrl: [
                        { required: true, message: '请输入目标路径', trigger: 'blur' }
                    ],
                    details: [
                        { required: true, message: '请输入备注详情', trigger: 'blur' }
                    ],
                    tipType: [
                        { required: true, message: '请选择提示类型', trigger: 'change' }
                    ],
                    onlineStart: [
                        { type: 'date', required: true, message: '请选择上线时间', trigger: 'change' }
                    ],
                    onlineEnd: [
                        { type: 'date', required: true, message: '请选择下线时间', trigger: 'change' }
                    ],
                    merchantId: [
                        { type: 'number', required: true, message: '请选择广告商ID', trigger: 'change' }
                    ],
                    addweightNo: [
                        { required: true, message: '请选择权重', trigger: 'change' }
                    ],
                },
                // 新增界面数据
                addForm: {},
                filters: {
                    value: '',
                    options: [{
                        value: 'I',
                        label: '待处理'
                    }, {
                        value: 'W',
                        label: ' 待上架'
                    }, {
                        value: 'ON',
                        label: ' 已上架'
                    }, {
                        value: 'OFF',
                        label: '已下架'
                    }]
                },
                selectFile: {
                    value: '',
                    options: [{
                        value: "",
                        label: '全部'
                    },
                    {
                        value: 'I',
                        label: '待处理'
                    }, {
                        value: 'W',
                        label: ' 待上架'
                    }, {
                        value: 'ON',
                        label: ' 已上架'
                    }, {
                        value: 'OFF',
                        label: '已下架'
                    }]
                },
                tipType: "",
                tipTypes: [{
                    value: '0',
                    label: '无标签',
                }, {
                    value: '1',
                    label: 'hot标签',

                }],
                filteradd: {
                    options: [{
                        value: '0',
                        label: '无轮播图',
                    }, {
                        value: '1',
                        label: '轮播图第一张',
                    }, {
                        value: '2',
                        label: '轮播图第二张',
                    }, {
                        value: '3',
                        label: '轮播图第三张',
                    }]
                },
                weightNos: {
                    options: [{
                        value: '0',
                        label: '不置顶'
                    }, {
                        value: '10',
                        label: '置顶第三'
                    }, {
                        value: '20',
                        label: '置顶第二'
                    }, {
                        value: '30',
                        label: '置顶第一'

                    }]
                },
                startPickerOptions: this.beginDate(),
                startDate: '',
                endPickerOptions: this.processDate(),
                endDate: '',
                createShow: false,
                modifyShow: false,
                deleteShow: false,
                lookShow: false,
                merchantId: "",
                adStus: "ON",
                onlineEnd: "",
                onlineStart: "",
                imageUrl1: '',
                imageUrl2: '',
                imageUrl3: '',
                imageUrl4: '',
                addbannerNo: '',
                addweightNo: '',
                baseurl: "",
                imgUrl: "",
                start: '',
                end:"",
            }
        },
        components: {
            tableUse,
           
        },
        mounted() {
            let userParams = {
                adStatus: '',
                createStartTime: '',
                createEndTime: ''
            }

            this.baseurl = root + '/uploadPicture'
            this.searchCMarket()
            this.searMerchantAd(userParams)
            this.createShow = global.judgePermissionName('advertis:create', this.$store.getters.getPermissionName)
            this.modifyShow = global.judgePermissionName('advertis:modify', this.$store.getters.getPermissionName)
            this.deleteShow = global.judgePermissionName('advertis:delete', this.$store.getters.getPermissionName)
            this.lookShow = global.judgePermissionName('advertis:view', this.$store.getters.getPermissionName)
            // $b = $(".headerOl");
            var  $b = document.getElementById("makeupCo");  
            var  $a = document.getElementById("typenum");
           
            // $(document).on({
            //     "click": function(e) {
            //         var src = e.target;
            //         if(src.id && (src.id === "a" ||src.id === "b")) {
            //             return false;
            //         } else {
            //             // $b.hide();
            //             isShow =false
            //             alert(222)
            //         }
            //     }
            // });

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
            },
            name(){
                this.dataObj={
                    cmarketMerchantId:this.addForm.merchantId
                }
                return this.addForm.merchantId
            }
        },
        watch: {
            addFormVisible (val) {
              this.resetDateInfo()
            },
            editFormVisible (val) {
              this.resetDateInfo()
            },
        },
        methods: {
             handleClick(tab, event) {
                 this.istab = tab.index
                 console.log(tab.index)
                console.log(tab, event);
            },
            resetDateInfo () {
              this.start = this.end = ''
            },
            selectedOnline (start) {
                this.start = start
            },
            selectedEnd (endDate) {
                this.end = endDate

            },
            processDate () {
                let vm = this
                return {
                    disabledDate (time) {
                        if (vm.start) {
                            return new Date(vm.start).getTime() > time.getTime()
                        }
                    }
                }
            },
            beginDate () {
                let vm = this
                return {
                disabledDate (time) {
                    if (vm.end) {
                    return new Date(vm.end).getTime() < time.getTime()
                    }
                }
                }
            },
            changeimg(file, fileList) {
                console.log(file)
                console.log(fileList)
            },
            changeimage(file, fileList) {

                this.img2 = file.response.data;


            },
            Method(){
                dataObj.cmarketMerchantComment =  this.addForm.merchantId;
                alert( this.addForm.merchantId)
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            searMerchantAd(userParams) {
                let vm = this
                userParams.createStartTime = Date.parse(userParams.createStartTime)
                userParams.createEndTime = Date.parse(userParams.createEndTime)
                getApi('searMerchantAd', userParams, function (res) {
                    if (res.data.code === 200) {
                        vm.totalPage = res.data.total
                        vm.tableData = res.data.data
                        for (var i = 0; i < vm.tableData.length; i++) {

                            let state = vm.tableData[i].adStatus
                            switch (state) {
                                case 'I':

                                    vm.tableData[i].Status = '待处理'
                                    break
                                case 'ON':

                                    vm.tableData[i].Status = '已上架'
                                    break
                                case 'W':

                                    vm.tableData[i].Status = '待上架'
                                    break
                                case 'OFF':
                                    vm.tableData[i].Status = '已下架'
                                    break
                                default:
                            }
                        }
                        // vm.fPage(vm.tableData)
                        // vm.$refs.chil.fPage(vm.tableData)  
                    }
                })
            },

            // fPage (list) {
            //     this.tableFData = list.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + this.pageSize)
            // },
           
            // 显示编辑界面
            handleEdit(index, row) {
                this.editFormVisible = true
                this.editForm = Object.assign({}, row);
                this.editFormContainer = Object.assign({}, row);
                this.imageUrl1 = `${process.env.IMG_SERVER}` + this.editForm.img1;
                this.imageUrl2 = `${process.env.IMG_SERVER}` + this.editForm.img2;
                this.img1 = this.editForm.img1;
                this.img2 = this.editForm.img2;
                this.editForm.weightNo = this.editForm.weightNo.toString();
                this.editForm.bannerNo = this.editForm.bannerNo.toString()
                this.editForm.tipType = this.editForm.tipType.toString();
                this.dataObj={
                    cmarketMerchantId:this.editForm.merchantId
                }

            },
            // 显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm={};
                this.imageUrl3 = "";
                this.imageUrl4 = "";
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            searchCMarket() {
                let self = this;

                getApi('searchCMarket', function (res) {
                    if (res.data.code === 200) {
                        self.neameIds = res.data.data;
                    }
                })
            },

            handleAvatarSuccessImg1(res, file) {
                if(res.code ==200){
                    this.imageUrl1 = URL.createObjectURL(file.raw);
                  this.img1 = res.data;
                }else{
                     this.$confirm(res.message, '提示')
                }
            },
            handleAvatarSuccessImg2(res, file) {
                if(res.code ==200){
                    this.imageUrl2 = URL.createObjectURL(file.raw);
                   this.img2 = res.data;
                }else{
                    this.$confirm(res.message, '提示')
                }

            },
            handleAvatarSuccessImg3(res, file) {
                if(res.code ==200){
                    this.imageUrl3 = URL.createObjectURL(file.raw);
                   this.img3 = res.data;
                }else{
                    this.$confirm(res.message, '提示')
                }
            },
            handleAvatarSuccessImg4(res, file) {
                if(res.code ==200){
                   this.imageUrl4 = URL.createObjectURL(file.raw);
                this.img4 = res.data;
                }else{
                    this.$confirm(res.message, '提示')
                }

            },
            // 编辑
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if (this.editForm.bannerNo == 0 && !this.imageUrl2) {
                            this.$confirm('如果Banner位置为无轮播图，则小图像必选', '提示', {})
                            return
                        } else if (this.editForm.bannerNo != 0 && !this.imageUrl1) {
                            this.$confirm('如果Banner位置为有轮播图，则轮播图必选', '提示', {})
                            return
                        }
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            this.editForm.onlineStartVO = Date.parse(this.editForm.onlineStartVO)
                            this.editForm.onlineEndVO = Date.parse(this.editForm.onlineEndVO)
                            let userParams = {
                                id: this.editForm.id,
                                name: this.editForm.name,
                                tags: this.editForm.tags,
                                targetUrl: this.editForm.targetUrl,
                                details: this.editForm.details,
                                tipType: this.editForm.tipType,
                                onlineEndVO:  this.editForm.onlineEndVO,
                                onlineStartVO: this.editForm.onlineStartVO,
                                merchantId: this.editForm.merchantId,
                                img1: this.img1,
                                img2: this.img2,
                                adStatus: this.editForm.adStatus,
                                bannerNo: this.editForm.bannerNo,
                                weightNo: this.editForm.weightNo,
                            }
                            let vm = this
                            getApi('updatechCMarket', userParams, function (res) {
                                vm.editFormVisible = vm.editLoading = false
                                vm.$refs['editForm'].resetFields()
                                if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                                    vm.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    })
                                    vm.searMerchantAd({ status: vm.selectFile.value, createStartTime: vm.startDate, createEndTime: vm.endDate })
                                } else {
                                    vm.$message({
                                        message: res.data.message,
                                        type: 'error'
                                    })
                                }
                            })
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 新增
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        if (this.addForm.addbannerNo == 0 && !this.img4) {
                            this.$confirm('如果Banner位置为无轮播图，则小图像必选', '提示', {})
                            return
                        } else if (this.addForm.addbannerNo != 0 && !this.img3) {
                            this.$confirm('如果Banner位置为有轮播图，则轮播图必选', '提示', {})
                            return
                        }
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true
                            if (typeof this.addForm.onlineEnd == 'object') {
                                this.addForm.onlineEnd = Date.parse(this.addForm.onlineEnd)
                            }
                            if (typeof this.addForm.onlineStart == 'object') {
                                this.addForm.onlineStart = Date.parse(this.addForm.onlineStart)
                            }

                            let userParams = {
                                name: this.addForm.name,
                                tags: this.addForm.tags,
                                bannerNo: this.addForm.addbannerNo,
                                targetUrl: this.addForm.targetUrl,
                                details: this.addForm.details,
                                tipType: this.addForm.tipType,
                                img1: this.img3,
                                img2: this.img4,
                                merchantId: this.addForm.merchantId,
                                onlineEndVO: this.addForm.onlineEnd,
                                onlineStartVO: this.addForm.onlineStart,
                                weightNo: this.addForm.addweightNo,
                            }
                            let vm = this
                            getApi('addMerchantAd', userParams, function (res) {
                                vm.addLoading = vm.addFormVisible = false
                                vm.$refs['addForm'].resetFields()
                                if (res.data.code == 200 && res.data.message.toLowerCase() == 'ok') {
                                    vm.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    })

                                    vm.searMerchantAd({ status: vm.selectFile.value, createStartTime: vm.startDate, createEndTime: vm.endDate })
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
            }
        }
    }

</script>

<style lang="less" rel="stylesheet/less" scoped>
.is-required .el-form-item__label {
    text-align:left !important;
}
.el-tabs__nav-scroll .el-tabs__active-bar{
       background-color: #fff !important;
}
.el-tabs .el-tabs__item {
   font-size: 20px !important;
    background: #ccc;
    margin-right: 20px;
    border: 1px solid #bfcbd9;
}
.el-tabs__item.is-active {
    color: #20a0ff;
    background: red;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px !important;
    height: 120px !important;
    line-height: 120px !important;
    text-align: center;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
}
.avatar {
    width: 120px !important;
    height: 120px !important;
    display: block;
}
.avatar-uploader .el-upload ,.el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  body {
    margin: 0px;
    padding: 0px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  #app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
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
