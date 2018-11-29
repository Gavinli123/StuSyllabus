var WxParse = require('../../../wxParse/wxParse.js');
Page({

  data: {
    //detail:null

  },

  onLoad: function () {
      var detail = wx.getStorageSync('detail');
      var article = detail.DOCCONTENT;
      // console.log(detail);
      // console.log(article);
      var regex = /<o:p>/gm;
      var regex2 =/(!@#\$%\^&\*)+/gm;
      var title = detail.DOCSUBJECT;
      var regex3=new RegExp(title,"");
      article=article.replace(regex,"");
      // console.log("1");
      article = article.replace(regex2, "");
      // console.log("2");
      article=article.replace(regex3,"");
      // console.log(article);
      WxParse.wxParse('article', 'html', article, this, 5);
    }
  })