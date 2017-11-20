<template>
  <div>
    <button @click="testGet">测试get请求</button>
    <span>get请求结果：{{testGetResponse}}</span>
    <br>
    <button @click="testPost">测试post请求</button>
    <span>post请求结果：{{testPostResponse}}</span>
    <br>
    <button @click="testPut">测试put请求</button>
    <span>put请求结果：{{testPutResponse}}</span>
    <br>

    <el-form>
      <el-form-item label="上传图片：">
        <el-upload :headers="headerData" :action="url" :on-success="handleAvatarSuccessImg">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="width: 100px; height: 100px;"><img style="width: 100%;" :src="imgUrl" alt="testPic" /></div>
  </div>
</template>
<script>
import { getApi } from '../api/api'
export default {
    data() {
      return {
        params: {
          accounts: 'admin',
          password: 1
        },
        testGetResponse: '',
        testPostResponse: '',
        testPutResponse: '',
        headerData: { authorization: localStorage.getItem('userId') },
        url: '/apis/picTest',
        imgUrl: ''
      };
    },
    methods: {
      testGet () {
        let vm = this
        getApi('getTest','get', vm.params, function (res) {
          vm.testGetResponse = res.data.data
        })
      },
      testPost () {
        let vm = this
        getApi('postTest','post', vm.params, function (res) {
          vm.testPostResponse = res.data.data
        })
      },
      testPut () {
        let vm = this
        getApi('putTest','put', vm.params, function (res) {
          vm.testPutResponse = res.data.data
        })
      },
      handleAvatarSuccessImg (res, file) {
        if(res.code ==200){
          this.imgUrl = URL.createObjectURL(file.raw);
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
