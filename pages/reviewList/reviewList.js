// pages/reviewlist/reviewlist.js
const sendRequestApi = require('../../api/sendRequestApi.js');
let listArr = [];

Page({
  data: {
    isShowPage: false,
    pingFangList:[],
    pageIndex: 1,
    pageSize: 10,
    more: true,
    noMoreData: true,
    keywords: "",
    isShowPFMenu: true,
    isShowSQMenu: true,
    isLink: false
  },
  onLoad: function (opts) {
    if (opts.keyWord){      
      this.setData({
        keywords: opts.keyWord
      });

      listArr = [];
      
      this.setData({
        isLink: true
      });
    }    

    let params = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      keywords: opts.keyWord
    }

    wx.showNavigationBarLoading();
    this.getList(params);
  },
  onReachBottom: function () {
    let pageIndex = this.data.pageIndex;
    this.setData({
      pageIndex: pageIndex + 1
    });
    pageIndex++;

    let params = {
      pageIndex: pageIndex,
      pageSize: this.data.pageSize,
      keywords: this.data.keywords
    }   

    if (this.data.more){
      wx.showLoading({
        title: "加载中"
      });
      this.getList(params);
    }    
  },
  getList: function (params){
    sendRequestApi.getPingFangListApi(params).then(res => {
      if (res.data.code == 0) {    
        wx.hideNavigationBarLoading();
        wx.hideLoading();

        let { data: { data: { more, list } } } = res;
        for (var i in list){
          listArr.push(list[i]);
        }

        this.setData({
          isShowPage: true,
          pingFangList: listArr
        });

        if (!more && list.length > this.data.pageSize){          
          this.setData({
            more: false,
            noMoreData: false
          });
        } else if (list.length < 1){
          this.setData({
            more: false,
            noMoreData: false
          });
        }
      }
    }); 
  },
  setClipboardData: function (e) {
    var data = "订单号：" + e.currentTarget.dataset.orderno + " 房产详细地址：" + e.currentTarget.dataset.address;
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  pingFangTab: function(){
    this.setData({
      isShowPFMenu: !this.data.isShowPFMenu,
      isShowSQMenu: true
    });
  },
  authorizatioTab: function(){
    this.setData({
      isShowPFMenu: true,
      isShowSQMenu: !this.data.isShowSQMenu
    });
  }
})