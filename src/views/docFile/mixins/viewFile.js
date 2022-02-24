import {request} from '@/network'
export const viewFile = {

  data() {
    return {
      fileUrl: '',//文件链接，根据文件类型判断用什么弹框处理文件链接
      fileType:'pdf',//pdf/img/word/excel
      // pdfUrl: 'http://0.0.0.0:8080/static/AWEIS_Setup_Guide_v1_2_20_0.pdf',
      pageNum_pdf: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
    }
  },
  methods: {
    openViewPdf(){
      this.fileType='pdf';
      this.openViewFileModal();
    },
    // 查看原件 中转站
    // openViewFileTranslator(){
    //   switch (this.cellClickRow_resource_bot.FileExt){
    //     case '.png':
    //       this.fileType='img';
    //       break;
    //     case '.jpg':
    //       this.fileType='img';
    //       break;
    //     case '.xlsx':
    //       this.fileType='excel';
    //       break;
    //     case '.docx':
    //       this.fileType='word';
    //       break;
    //     default:
    //       this.fileType='';
    //   }
    // },
    // 查看文件 获取文件的url 并打开弹框查看
    // suffix传后缀名
    openViewFileModal(){
      // 根据当前行的后缀名判断类型 判断发送什么参数，以及打开什么弹框
      this.$store.commit('showLoading',{show:true});
      request({
        url:this.$collections.fileManager.getViewPdfUrl,
        params:{
          ty:'FileView',
          ViewType:this.fileType,
          FileId:this.cellClickRow_resource_bot.Id,
        }
      }).then(res=>{
        this.$store.commit('showLoading',{show:true});
        if (res.reCode==0){
          switch (this.fileType){
            case 'pdf':
              this.$refs.modalViewPdf.open();
              break;
            case 'img':
              this.$refs.modalViewPicture.open();
              break;
            case 'excel':
              this.$refs.modalViewExcel.open();
              break;
            case 'word':
              this.$refs.modalViewWord.open();
              break;
          }
          this.fileUrl=res.reData;
        }else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }else {
          this.closeModals();
        }
      })
    },
    // 上一页
    prePage() {
      let page = this.pageNum_pdf
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum_pdf = page
    },
    // 下一页
    nextPage() {
      let page = this.pageNum_pdf
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum_pdf = page
    },
  }
}
